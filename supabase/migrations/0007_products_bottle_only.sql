-- Cole no SQL Editor do Supabase e clique em "Run".
-- Selo para produtos que só existem no frasco completo (sem decante disponível).
-- Nesses casos, volume_ml passa a guardar o volume do frasco (ex.: 70), não
-- de um decante, e o site não deixa adicionar ao carrinho — só mostra o
-- preço do frasco e direciona pro WhatsApp.

alter table public.products
  add column if not exists is_bottle_only boolean not null default false;
