// Um produto entra em "Promoções" quando tem price_original preenchido
// (preço "de") OU quando é um kit — kits sempre aparecem em promoções,
// mesmo sem desconto. Usado como filtro .or() do PostgREST/Supabase.
export const PROMO_OR_FILTER = "price_original.not.is.null,is_kit.eq.true";
