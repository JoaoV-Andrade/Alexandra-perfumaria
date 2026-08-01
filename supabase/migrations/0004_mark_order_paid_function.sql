-- Cole no SQL Editor do Supabase e clique em "Run".
-- Função chamada pelo webhook do Mercado Pago quando um pagamento é
-- aprovado. Faz, na mesma transação: baixa de estoque de todos os itens do
-- pedido (atômica, com checagem de estoque suficiente) e marca o pedido
-- como "pago". É idempotente: se o pedido já estiver "pago", não faz nada
-- (evita baixar estoque duas vezes se o Mercado Pago reenviar a notificação).

create or replace function public.mark_order_paid(p_order_id uuid, p_payment_id text)
returns void
language plpgsql
as $$
declare
  v_status text;
  v_items jsonb;
  v_item jsonb;
  v_updated_rows integer;
begin
  -- Trava a linha do pedido até o fim da transação, para que duas
  -- notificações do mesmo pagamento chegando ao mesmo tempo não baixem o
  -- estoque em duplicidade.
  select status, items into v_status, v_items
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'Pedido % não encontrado', p_order_id;
  end if;

  if v_status = 'pago' then
    return;
  end if;

  for v_item in select * from jsonb_array_elements(v_items)
  loop
    update public.products
    set stock = stock - (v_item ->> 'quantity')::integer
    where id = (v_item ->> 'product_id')::uuid
      and stock >= (v_item ->> 'quantity')::integer;

    get diagnostics v_updated_rows = row_count;

    if v_updated_rows = 0 then
      raise exception 'Estoque insuficiente para o produto %', v_item ->> 'product_id';
    end if;
  end loop;

  update public.orders
  set status = 'pago', mp_payment_id = p_payment_id
  where id = p_order_id;
end;
$$;

-- Só o servidor (service role) chama essa função; ninguém mais precisa dela.
revoke execute on function public.mark_order_paid(uuid, text) from public, anon, authenticated;
