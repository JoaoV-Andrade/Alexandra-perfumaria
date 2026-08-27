# Projeto: E-commerce de Perfumes

Loja virtual de perfumes com catálogo, checkout via Asaas Checkout (Pix e cartão), pedido alternativo via WhatsApp e painel administrativo. Público acessa majoritariamente pelo celular: **mobile-first sempre**.

## Contexto de quem comanda o projeto

Sei pouco de programação e pouco de React. Portanto:

- Explique em português simples o que cada trecho importante faz.
- Faça uma tarefa por vez; não avance para a próxima sem eu pedir.
- Prefira soluções simples e padrão em vez de abstrações sofisticadas.
- Sempre me diga como testar o que foi feito (comando + o que devo ver na tela).

## Contexto do negócio

A loja vende **decantes**: frações de 5ml (às vezes 10ml) retiradas de perfumes importados 100% originais. **Não vendemos o frasco completo pelo site.**

- Isso deve ficar explícito e transparente em todo o site: páginas de produto, home e checkout. Nunca usar textos ou imagens que sugiram a venda do frasco lacrado.
- Quem quiser o frasco completo deve ser direcionado ao WhatsApp da loja (link wa.me com mensagem pré-pronta "Olá! Tenho interesse no frasco completo de [nome do perfume]").
- Argumentos de venda dos decantes: custo acessível para conhecer perfumes importados, praticidade para o dia a dia e para viagens, ideal para experimentar antes de investir no frasco grande.
- Tom de voz: acolhedor e elegante, focado em público feminino exigente; transparência e confiança são valores centrais.
- Operação: postagem em 2 a 5 dias úteis após confirmação do pagamento; entrega para todo o Brasil com rastreio; quantidade limitada por fragrância (pronta entrega).

## Stack (não trocar sem me consultar)

- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase: Postgres, Auth (só a administradora tem login) e Storage (fotos)
- Hospedagem: Vercel
- Pagamentos: **Asaas Checkout** (Pix e cartão, página hospedada pelo Asaas; nunca checkout transparente com dados de cartão passando pelo nosso servidor) — ambiente de produção (conta verificada no Asaas)
- Frete: **API do Melhor Envio** (cotação por CEP; token em variável de ambiente; usar o ambiente sandbox nos testes e só trocar para produção quando eu pedir)
- Sem login para clientes: **guest checkout** (nome, WhatsApp, e-mail, CPF, endereço no pedido — CPF é exigido pelo Asaas para criar a cobrança)

## Design system (obrigatório em todas as telas)

Estilo: **minimalista, fluido e fácil de usar**. Poucos elementos por tela, bastante espaço em branco, hierarquia clara, nada de poluição visual.

Paleta (tokens definidos como variáveis CSS em `src/app/globals.css`, mapeados pro Tailwind via `@theme inline` — usar sempre os tokens, nunca hex solto no código). **Vale só pra loja pública** (home, catálogo, produto, carrinho, checkout, páginas institucionais); **o painel `/admin` mantém a paleta antiga** (turquesa como único destaque, fundos neutros), documentada mais abaixo.

- **Fundo das seções (`--bg-primary` / `--bg-alt`)**: as seções da loja alternam fundo cheio turquesa (`#44e2d9`, `bg-bg-primary`) e branco (`#ffffff`, `bg-bg-alt`) — seção 1 turquesa, seção 2 branca, seção 3 turquesa, e assim por diante. Cabeçalho e rodapé ficam de fora dessa alternância (fundo branco/neutro fixo).
- **Dourado (`--accent-gold-1/2/3`)**: gradiente `#d2ac47 → #f7ef8a → #ae8625` (`bg-[image:var(--gold-gradient)]`), usado em fundos preenchidos — botões (CTA), badges. Texto sobre o gradiente é sempre escuro (`text-accent-foreground`, `#0f172a`), nunca branco.
- **Link e ícones/bordas de destaque (`--link` `#8a6a1a`, hover `--link-hover` `#6f5716`)**: dourado mais escuro que o do gradiente acima — calibrado pra fechar contraste WCAG AA (4,5:1) em texto normal sobre fundo branco ou turquesa, o que o dourado claro (`#f7ef8a`) e até o `#ae8625` puro sozinhos não conseguem.
- **Títulos (`--title-gradient`)**: gradiente dourado aplicado via `background-clip: text` (`bg-[image:var(--title-gradient)] bg-clip-text text-transparent`) **só quando o título está sobre fundo branco**. Sobre fundo turquesa, título fica em texto escuro sólido (`text-foreground`) — o gradiente claro não tem contraste suficiente sobre turquesa. Mesma regra vale pra ícones/links soltos (sem fundo próprio): dourado sobre branco, escuro sobre turquesa. Elementos com fundo preenchido (botões, badges) não têm essa restrição, porque o contraste é sempre contra o próprio gradiente, não contra a seção.
- **Fundos neutros auxiliares**: branco `#ffffff` e off-white/cinza-claro (`#f8fafc` / `#f1f5f9`, `--surface` / `--surface-alt`) para cards dentro das seções.
- **Textos**: cinza-escuro quase preto (`#1f2937`, `--foreground`) para títulos e corpo, cinza médio (`#475569`, `--muted-foreground`) para textos secundários — escurecido em relação ao tom antigo pra continuar legível sobre o novo fundo turquesa.
- Uma única família tipográfica limpa (ex.: Inter via next/font), variando só peso e tamanho.

**Paleta do painel `/admin`** (não muda): turquesa `#44e2d9` como único destaque (`--accent`/`--accent-foreground`), fundos neutros brancos/cinza-claro, mesmos textos escuros acima. Componentes compartilhados entre loja e admin (`form-field.tsx`, `form-message.tsx`, `empty-state.tsx`, `product-image.tsx`, `lib/ui.ts`) usam essa paleta antiga mesmo quando aparecem na loja (ex.: aro de foco dos campos do checkout), pra não vazar a paleta nova pro admin.

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

**products**: id, name, brand, description, volume_ml, price (centavos, integer), price_original (centavos, integer, opcional — só quando o produto de fato custava mais e baixou; exibe "De R$ X por R$ Y" e selo PROMOÇÃO), stock (integer), images (text[]), active (boolean), is_bestseller (boolean), is_exclusive (boolean), is_kit (boolean — conjunto de decantes vendido como produto próprio), notes (text, opcional — notas olfativas), weight_g, created_at

**orders**: id, customer_name, customer_phone, customer_email, customer_cpf, address (jsonb), items (jsonb — snapshot com preço do momento da compra), subtotal, shipping_cost, shipping_service, total, status, payment_id, checkout_id, tracking_code, created_at

Status possíveis de order: aguardando_whatsapp | pendente | pago | recusado | enviado | cancelado

## Regras de segurança (invioláveis)

1. Preços e totais são SEMPRE recalculados no servidor a partir do banco. O navegador só envia ids e quantidades.
2. Chaves secretas (Supabase service role, API key do Asaas, token do Melhor Envio) só em variáveis de ambiente. Nunca em código do cliente, nunca commitadas.
3. Webhook do Asaas: validar o token no header `asaas-access-token` E confirmar o pagamento consultando a API do Asaas pelo id do checkout. Nunca confiar apenas no corpo da notificação.
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
