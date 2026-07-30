-- Cole no SQL Editor do Supabase e clique em "Run".
-- Pedidos via WhatsApp coletam só nome e telefone no site; e-mail e
-- endereço ficam para a conversa/confirmação manual, então não podem
-- mais ser obrigatórios na tabela orders.

alter table public.orders
  alter column customer_email drop not null,
  alter column address drop not null;
