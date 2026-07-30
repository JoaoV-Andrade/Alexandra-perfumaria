# Projeto: E-commerce de Perfumes

Loja virtual de perfumes com catálogo, checkout via Mercado Pago (Checkout Pro), pedido alternativo via WhatsApp e painel administrativo. Público acessa majoritariamente pelo celular: **mobile-first sempre**.

## Contexto de quem comanda o projeto

Sei pouco de programação e pouco de React. Portanto:

- Explique em português simples o que cada trecho importante faz.
- Faça uma tarefa por vez; não avance para a próxima sem eu pedir.
- Prefira soluções simples e padrão em vez de abstrações sofisticadas.
- Sempre me diga como testar o que foi feito (comando + o que devo ver na tela).

## Stack (não trocar sem me consultar)

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase: Postgres, Auth (só a administradora tem login) e Storage (fotos)
- Hospedagem: Vercel
- Pagamentos: Mercado Pago **Checkout Pro** (redirect; nunca Checkout Transparente)
- Frete: **API do Melhor Envio** (cotação por CEP; token em variável de ambiente; usar o ambiente sandbox nos testes e só trocar para produção quando eu pedir)
- Sem login para clientes: **guest checkout** (nome, WhatsApp, e-mail, endereço no pedido)

## Design system (obrigatório em todas as telas)

Estilo: **minimalista, fluido e fácil de usar**. Poucos elementos por tela, bastante espaço em branco, hierarquia clara, nada de poluição visual.

Paleta (definir como tokens no Tailwind, ex.: `accent`, e usar sempre os tokens, nunca hex solto no código):

- **Destaque `#44e2d9`**: SOMENTE para detalhes e ênfase — botões principais (CTA), badges, links em hover, ícones ativos, bordas de foco, pequenos acentos. Texto sobre essa cor deve ser escuro (ex.: `#0f172a`), nunca branco. Nunca usar essa cor em texto pequeno sobre fundo claro (contraste insuficiente).
- **Fundos neutros**: branco `#ffffff` e off-white/cinza-claro (ex.: `#f8fafc` / `#f1f5f9`) para seções e cards.
- **Textos**: cinza-escuro quase preto (ex.: `#0f172a`) para títulos, cinza médio (ex.: `#64748b`) para textos secundários.
- Uma única família tipográfica limpa (ex.: Inter via next/font), variando só peso e tamanho.

Regras de UX:

- Botões e áreas de toque grandes (mínimo ~44px de altura) — uso é majoritariamente no celular.
- Transições suaves e discretas (hover/focus/aparecimento); nada de animações chamativas.
- Feedback claro em toda ação: estados de carregando, sucesso e erro sempre visíveis.
- Fluxo de compra com o mínimo de passos e de campos possível.
- Estados vazios amigáveis (carrinho vazio, busca sem resultado) com orientação do que fazer.

## Qualidade de código (obrigatório)

- Código limpo e didático: componentes pequenos, com uma responsabilidade cada, em arquivos próprios.
- Nomes de variáveis, funções e componentes descritivos e consistentes.
- TypeScript com tipos explícitos nas fronteiras (props, retornos de API, dados do banco); evitar `any`.
- Sem duplicação: lógica repetida vira função utilitária ou hook.
- Comentários curtos em português apenas onde a intenção não for óbvia.
- Estrutura de pastas organizada e previsível (ex.: `components/`, `lib/`, `app/api/`).
- Não adicionar bibliotecas sem me consultar; preferir o que Next/Tailwind/Supabase já resolvem.
- Configurar ESLint + Prettier no início do projeto e manter o código sempre formatado.

## Modelo de dados

**products**: id, name, brand, description, volume_ml, price (centavos, integer), stock (integer), images (text[]), active (boolean), weight_g, created_at

**orders**: id, customer_name, customer_phone, customer_email, address (jsonb), items (jsonb — snapshot com preço do momento da compra), subtotal, shipping_cost, shipping_service, total, status, mp_payment_id, mp_preference_id, tracking_code, created_at

Status possíveis de order: aguardando_whatsapp | pendente | pago | recusado | enviado | cancelado

## Regras de segurança (invioláveis)

1. Preços e totais são SEMPRE recalculados no servidor a partir do banco. O navegador só envia ids e quantidades.
2. Chaves secretas (Supabase service role, token do Mercado Pago, token do Melhor Envio) só em variáveis de ambiente. Nunca em código do cliente, nunca commitadas.
3. Webhook do Mercado Pago: validar assinatura x-signature E confirmar o pagamento consultando a API do MP pelo payment id. Nunca confiar apenas no corpo da notificação.
4. Baixa de estoque atômica: função SQL única com `UPDATE ... SET stock = stock - qtd WHERE id = X AND stock >= qtd` para todos os itens na mesma transação. Webhook idempotente: se o pedido já está "pago", não baixar estoque de novo.
5. RLS ativada em todas as tabelas: leitura pública só de products com active = true; orders e escrita só via servidor/admin autenticado.
6. Pedidos via WhatsApp NÃO baixam estoque automaticamente (confirmação manual no painel).

## Decisões de produto

- Produto com stock = 0 aparece como "Esgotado" (não some do catálogo).
- Botão WhatsApp monta mensagem com itens + total e abre wa.me; antes de redirecionar, salva o pedido com status aguardando_whatsapp.
- Sem nota fiscal e sem cupons no MVP. Não implementar.
- Painel em /admin, protegido por Supabase Auth (uma única usuária). O painel segue o mesmo design system.
- Imagens sempre via next/image, formato otimizado.

## Comandos

- `npm run dev` — rodar local
- Deploy: push na branch main (Vercel automático)
