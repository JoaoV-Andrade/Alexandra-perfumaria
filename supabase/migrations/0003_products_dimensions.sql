-- Cole no SQL Editor do Supabase e clique em "Run".
-- Adiciona comprimento/largura/altura aos produtos, necessários para
-- calcular o frete (peso + dimensões) na cotação do Melhor Envio.
-- Produtos já cadastrados recebem uma medida padrão (16x11x4cm) — edite
-- pelo Table Editor os que tiverem uma caixa bem diferente disso.

alter table public.products
  add column if not exists length_cm integer not null default 16 check (length_cm > 0),
  add column if not exists width_cm integer not null default 11 check (width_cm > 0),
  add column if not exists height_cm integer not null default 4 check (height_cm > 0);
