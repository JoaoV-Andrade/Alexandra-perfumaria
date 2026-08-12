export type NavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Promoções", href: "/promocoes" },
  { label: "Mais Vendidos", href: "/mais-vendidos" },
  { label: "Kits de Decantes", href: "/kits" },
  { label: "Exclusivos", href: "/exclusivos" },
  { label: "Masculinos", href: "/masculinos" },
  { label: "Todos os Perfumes", href: "/perfumes" },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
const FULL_BOTTLE_MESSAGE =
  "Olá! Tenho interesse no frasco completo de um perfume.";
const CONTACT_MESSAGE = "Olá! Gostaria de tirar uma dúvida.";

export const FULL_BOTTLE_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(FULL_BOTTLE_MESSAGE)}`;
export const CONTACT_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(CONTACT_MESSAGE)}`;
