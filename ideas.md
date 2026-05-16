# Brainstorm de Design — PertoZap IA

## Contexto
Vitrine hiperlocal de pequenos negócios com cadastro simples, sugestões de IA e conversão via WhatsApp. Público: moradores de bairro e pequenos comerciantes. Tom: acessível, caloroso, local, confiável.

---

<response>
<text>

## Ideia 1 — "Mercado de Rua Digital"

**Design Movement:** Inspirado em design editorial de revistas de bairro e feiras livres brasileiras, com toques de brutalismo suave — tipografia grande, blocos de cor sólida e elementos gráficos que remetem a cartazes de comércio popular.

**Core Principles:**
1. Autenticidade local: o design deve parecer feito pelo bairro, não por uma startup de tecnologia.
2. Legibilidade imediata: informações claras em telas pequenas, sem decoração desnecessária.
3. Calor humano: cores quentes, formas orgânicas e linguagem direta.
4. Ação rápida: cada tela leva a uma ação concreta em no máximo dois cliques.

**Color Philosophy:** Paleta inspirada em feiras e mercados brasileiros. Verde-menta vibrante como cor principal (remetendo ao WhatsApp e frescor), laranja-manga como destaque de ofertas, creme-quente como fundo e grafite-suave para texto. A intenção é transmitir energia, acessibilidade e proximidade.

**Layout Paradigm:** Layout de cards em grid assimétrico, com cards de tamanhos variados que lembram bancas de feira. Hero compacto com busca proeminente. Navegação por chips de categoria no topo. Footer com métricas de impacto.

**Signature Elements:**
1. Ícones de categoria desenhados em estilo line-art com preenchimento colorido.
2. Badge "Oferta do Bairro" em destaque amarelo-laranja nos cards.
3. Botão WhatsApp verde pulsante como CTA principal.

**Interaction Philosophy:** Toques rápidos, feedback tátil visual (scale no press), transições curtas. Nada de loading screens elaborados — a interface deve parecer instantânea.

**Animation:** Entrada dos cards com stagger de 50ms, fade-in + translateY(8px). Botão WhatsApp com pulse suave a cada 3s. Chips de categoria com transição de cor em 150ms. Modal de detalhe entra com scale(0.96) → scale(1) em 200ms.

**Typography System:** Display: "Sora" (bold, geométrica, moderna mas acessível). Body: "DM Sans" (limpa, boa legibilidade em telas pequenas). Hierarquia: títulos em Sora Bold, subtítulos em Sora SemiBold, corpo em DM Sans Regular, labels em DM Sans Medium.

</text>
<probability>0.08</probability>
</response>

---

<response>
<text>

## Ideia 2 — "Mapa Vivo do Bairro"

**Design Movement:** Inspirado em design cartográfico ilustrado e interfaces de apps de delivery brasileiros, com estética clean e colorida. Referências visuais de mapas ilustrados de cidades e guias turísticos locais.

**Core Principles:**
1. Espacialidade: o bairro é o protagonista, não a tecnologia.
2. Descoberta lúdica: navegar deve parecer explorar o bairro.
3. Confiança visual: cards limpos, informações verificáveis, sem excesso.
4. Mobile-native: pensado para polegar, não para mouse.

**Color Philosophy:** Azul-céu como base (confiança e amplitude), verde-esmeralda para ações (WhatsApp), coral para ofertas e destaques, branco-neve para cards e cinza-ardósia para texto. A intenção é criar sensação de céu aberto, rua limpa e bairro organizado.

**Layout Paradigm:** Hero com ilustração de bairro e campo de busca centralizado. Seção de categorias em carrossel horizontal. Lista de negócios em cards verticais uniformes com foto, info e CTA. Formulário de cadastro em etapas curtas (wizard de 2 passos).

**Signature Elements:**
1. Ilustração de skyline de bairro no hero (gerada por IA).
2. Indicador de distância fictícia com ícone de pin em cada card.
3. Selo "Verificado pelo Bairro" como elemento de confiança.

**Interaction Philosophy:** Scroll suave, carrossel com snap, modais com backdrop blur. Foco em gestos naturais de mobile.

**Animation:** Hero com parallax sutil no scroll. Cards entram com fade + slide lateral em stagger de 60ms. Botão WhatsApp com hover scale(1.05) e active scale(0.97). Transição de página com crossfade de 180ms.

**Typography System:** Display: "Plus Jakarta Sans" (moderna, geométrica, amigável). Body: "Inter" (neutra, excelente legibilidade). Hierarquia: títulos em Plus Jakarta Sans Bold, corpo em Inter Regular, CTAs em Plus Jakarta Sans SemiBold.

</text>
<probability>0.05</probability>
</response>

---

<response>
<text>

## Ideia 3 — "Vitrine Comunitária"

**Design Movement:** Inspirado em design de produto brasileiro contemporâneo — clean, com personalidade, influenciado por Nubank e iFood mas com identidade própria. Mistura de flat design com micro-texturas e sombras suaves.

**Core Principles:**
1. Simplicidade radical: cada elemento tem uma razão de existir.
2. Personalidade brasileira: cores vivas mas não infantis, linguagem direta mas calorosa.
3. Conversão clara: o caminho até o WhatsApp nunca tem mais de dois passos.
4. Inclusão digital: interface que funciona para quem não é nativo digital.

**Color Philosophy:** Verde-floresta profundo (#166534) como cor principal (natureza, crescimento, WhatsApp), amarelo-sol (#EAB308) para ofertas e destaques, off-white quente (#FEFCE8) como fundo, e grafite (#1C1917) para texto. A paleta transmite crescimento, energia e autenticidade sem parecer corporativa.

**Layout Paradigm:** Layout vertical fluido, sem sidebar. Hero assimétrico com texto à esquerda e elemento visual à direita. Categorias em grid de ícones 3x2. Negócios em lista de cards com foto à esquerda e info à direita. Cadastro em formulário único com preview em tempo real.

**Signature Elements:**
1. Ícone de raio estilizado no logo (velocidade + energia local).
2. Tag "Oferta Relâmpago" em amarelo nos cards com promoção.
3. Contador de impacto animado no footer ("X comércios já conectados").

**Interaction Philosophy:** Feedback imediato em cada ação. Formulários com validação inline e sugestões de IA visíveis. Botões com estado pressed visível. Toast de confirmação após cadastro.

**Animation:** Cards com entrada staggered (40ms) usando opacity + translateY(12px) em 250ms com ease-out forte. Botão WhatsApp com gradient shift sutil no hover. Contador de impacto com animação de contagem. Modal com spring animation (framer-motion).

**Typography System:** Display: "Sora" (geométrica, moderna, com personalidade). Body: "Nunito Sans" (arredondada, amigável, boa legibilidade). Hierarquia: hero em Sora Bold 2.5rem, seções em Sora SemiBold 1.5rem, cards em Nunito Sans Regular, CTAs em Sora Medium.

</text>
<probability>0.07</probability>
</response>

---

## Decisão

Escolho a **Ideia 3 — "Vitrine Comunitária"** por ser a mais equilibrada entre personalidade brasileira, simplicidade radical e viabilidade de execução em 3 horas. A paleta verde-floresta + amarelo-sol é forte, memorável e conecta visualmente ao WhatsApp sem copiar. O layout vertical fluido é o mais rápido de implementar e o mais natural para mobile. A tipografia Sora + Nunito Sans oferece personalidade sem sacrificar legibilidade.

