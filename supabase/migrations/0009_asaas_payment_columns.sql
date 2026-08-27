-- Cole no SQL Editor do Supabase e clique em "Run".
-- Troca do gateway de pagamento (Mercado Pago -> Asaas): renomeia as colunas
-- que guardavam ids do Mercado Pago para nomes neutros, e adiciona o CPF do
-- cliente, exigido pelo Asaas para criar cobranças.

alter table public.orders rename column mp_payment_id to payment_id;
alter table public.orders rename column mp_preference_id to checkout_id;
alter table public.orders add column if not exists customer_cpf text;

alter index if exists orders_mp_payment_id_idx rename to orders_payment_id_idx;

-- Recria a função com o novo nome de coluna (mesma lógica de 0004, só troca
-- mp_payment_id por payment_id).
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
  set status = 'pago', payment_id = p_payment_id
  where id = p_order_id;
end;
$$;

revoke execute on function public.mark_order_paid(uuid, text) from public, anon, authenticated;
