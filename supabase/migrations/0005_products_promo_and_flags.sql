-- Cole no SQL Editor do Supabase e clique em "Run".
-- Adiciona promoção real, selos de destaque (mais vendido, exclusivo, kit)
-- e notas olfativas aos produtos.

alter table public.products
  -- preço "de", em centavos; só é preenchido quando o produto de fato
  -- custava mais e baixou de preço. Nulo = sem promoção, mostra só o preço normal.
  add column if not exists price_original integer
    check (price_original is null or price_original > price),
  add column if not exists is_bestseller boolean not null default false,
  add column if not exists is_exclusive boolean not null default false,
  -- kit: conjunto de decantes vendido como produto próprio (não é o frasco completo)
  add column if not exists is_kit boolean not null default false,
  add column if not exists notes text; -- notas olfativas, opcional

create index if not exists products_is_bestseller_idx on public.products (is_bestseller);
create index if not exists products_is_exclusive_idx on public.products (is_exclusive);
create index if not exists products_is_kit_idx on public.products (is_kit);
