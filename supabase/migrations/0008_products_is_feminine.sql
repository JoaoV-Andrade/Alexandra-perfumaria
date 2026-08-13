-- Cole no SQL Editor do Supabase e clique em "Run".
-- Transforma o selo "Exclusivo" na seção "Femininos": renomeia a coluna e
-- marca como femininos todos os perfumes que já existem e não são
-- masculinos nem kits.

alter table public.products rename column is_exclusive to is_feminine;
alter index if exists products_is_exclusive_idx rename to products_is_feminine_idx;

update public.products
set is_feminine = true
where is_masculine = false and is_kit = false;
