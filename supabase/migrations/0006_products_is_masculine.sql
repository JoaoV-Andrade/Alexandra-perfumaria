-- Cole no SQL Editor do Supabase e clique em "Run".
-- Adiciona o selo "Masculino", pra separar perfumes masculinos numa seção própria.

alter table public.products
  add column if not exists is_masculine boolean not null default false;

create index if not exists products_is_masculine_idx on public.products (is_masculine);
