-- Schema inicial do Alexandra Perfumaria.
-- Cole este arquivo inteiro no SQL Editor do Supabase e clique em "Run".

create extension if not exists pgcrypto;

-- =========================================
-- products
-- =========================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  description text,
  volume_ml integer not null check (volume_ml > 0),
  price integer not null check (price >= 0), -- preço em centavos
  stock integer not null default 0 check (stock >= 0),
  images text[] not null default '{}',
  active boolean not null default true,
  weight_g integer not null check (weight_g > 0),
  length_cm integer not null check (length_cm > 0),
  width_cm integer not null check (width_cm > 0),
  height_cm integer not null check (height_cm > 0),
  -- preço "de", em centavos; nulo = sem promoção (só usado quando o produto
  -- de fato custava mais e baixou de preço)
  price_original integer check (price_original is null or price_original > price),
  is_bestseller boolean not null default false,
  is_feminine boolean not null default false, -- perfume feminino, entra na seção "Femininos"
  is_kit boolean not null default false, -- kit: conjunto de decantes vendido como produto próprio
  is_masculine boolean not null default false, -- perfume masculino, entra na seção "Masculinos"
  -- só existe no frasco completo (sem decante); volume_ml vira o volume do
  -- frasco e o site não deixa adicionar ao carrinho, só mostra o preço e
  -- direciona pro WhatsApp
  is_bottle_only boolean not null default false,
  notes text, -- notas olfativas, opcional
  created_at timestamptz not null default now()
);

create index if not exists products_active_idx on public.products (active);
create index if not exists products_is_bestseller_idx on public.products (is_bestseller);
create index if not exists products_is_feminine_idx on public.products (is_feminine);
create index if not exists products_is_kit_idx on public.products (is_kit);
create index if not exists products_is_masculine_idx on public.products (is_masculine);

alter table public.products enable row level security;

-- Catálogo público: qualquer visitante lê só os produtos ativos.
create policy "products_public_read_active" on public.products for select
  to anon, authenticated
  using (active = true);

-- Só a administradora logada cria, edita ou remove produtos (inclusive os inativos).
create policy "products_admin_write" on public.products for all
  to authenticated
  using (true)
  with check (true);

-- =========================================
-- orders
-- =========================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  customer_email text, -- pedidos via WhatsApp podem não ter e-mail ainda
  address jsonb, -- idem: endereço combinado depois, na conversa do WhatsApp
  items jsonb not null, -- snapshot dos itens com preço no momento da compra
  subtotal integer not null check (subtotal >= 0),
  shipping_cost integer not null check (shipping_cost >= 0),
  shipping_service text,
  total integer not null check (total >= 0),
  status text not null check (
    status in (
      'aguardando_whatsapp',
      'pendente',
      'pago',
      'recusado',
      'enviado',
      'cancelado'
    )
  ),
  mp_payment_id text,
  mp_preference_id text,
  tracking_code text,
  created_at timestamptz not null default now()
);

create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_mp_payment_id_idx on public.orders (mp_payment_id);

alter table public.orders enable row level security;

-- Pedidos têm dados pessoais do cliente: sem acesso público. Criação e
-- confirmação de pagamento passam pelo servidor com a service role, que
-- ignora RLS. Só a administradora logada pode ver e atualizar pedidos.
create policy "orders_admin_read" on public.orders for select
  to authenticated
  using (true);

create policy "orders_admin_update" on public.orders for update
  to authenticated
  using (true)
  with check (true);
