export interface Business {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  distance: string;
  hours: string;
  description: string;
  offer: string;
  whatsapp: string;
  image: string;
  tags: string[];
}

export const categories = [
  { id: "alimentacao", label: "Alimentação", icon: "🍞" },
  { id: "mercado", label: "Mercado", icon: "🛒" },
  { id: "beleza", label: "Beleza", icon: "💇" },
  { id: "pet", label: "Pet", icon: "🐾" },
  { id: "servicos", label: "Serviços", icon: "🔧" },
  { id: "comercio", label: "Comércio", icon: "🛍️" },
];

export const businesses: Business[] = [
  {
    id: "padaria-sol-nascente",
    name: "Padaria Sol Nascente",
    category: "alimentacao",
    neighborhood: "Vila Esperança",
    distance: "350 m",
    hours: "Aberto até 19h",
    description: "Pães artesanais, bolos caseiros e café fresquinho todos os dias. Tradição de família há 15 anos no bairro.",
    offer: "Café + pão de queijo por R$ 9,90",
    whatsapp: "5511999990011",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    tags: ["café", "pães", "bolo"],
  },
  {
    id: "mercado-bom-vizinho",
    name: "Mercado Bom Vizinho",
    category: "mercado",
    neighborhood: "Vila Esperança",
    distance: "600 m",
    hours: "Aberto até 21h",
    description: "Seu mercadinho de confiança com frutas frescas, produtos de limpeza e tudo para o dia a dia.",
    offer: "Cesta básica com 8 itens em promoção",
    whatsapp: "5511999990022",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop",
    tags: ["mercado", "frutas", "cesta básica"],
  },
  {
    id: "bella-flor-cabelos",
    name: "Bella Flor Cabelos",
    category: "beleza",
    neighborhood: "Vila Esperança",
    distance: "450 m",
    hours: "Aberto até 18h",
    description: "Salão especializado em cabelos cacheados e crespos. Atendimento com hora marcada.",
    offer: "Escova com hidratação por R$ 49",
    whatsapp: "5511999990033",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    tags: ["cabelo", "hidratação", "escova"],
  },
  {
    id: "pet-amigo",
    name: "Pet Amigo",
    category: "pet",
    neighborhood: "Vila Esperança",
    distance: "800 m",
    hours: "Aberto até 20h",
    description: "Banho, tosa, ração premium e acessórios para seu melhor amigo. Veterinário disponível.",
    offer: "Banho pequeno porte com 15% off",
    whatsapp: "5511999990044",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
    tags: ["pet", "banho", "ração"],
  },
  {
    id: "papelaria-criativa",
    name: "Papelaria Criativa",
    category: "servicos",
    neighborhood: "Vila Esperança",
    distance: "300 m",
    hours: "Aberto até 17h30",
    description: "Impressão, encadernação, material escolar e presentes criativos. Xerox a partir de R$ 0,15.",
    offer: "Impressão colorida com 20% de desconto",
    whatsapp: "5511999990055",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
    tags: ["impressão", "papelaria", "xerox"],
  },
  {
    id: "marmitaria-dona-lucia",
    name: "Marmitaria Dona Lúcia",
    category: "alimentacao",
    neighborhood: "Vila Esperança",
    distance: "700 m",
    hours: "Aberto até 14h30",
    description: "Comida caseira feita com carinho. Cardápio variado todos os dias, com opção fitness.",
    offer: "Marmita do dia por R$ 18",
    whatsapp: "5511999990066",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    tags: ["marmita", "almoço", "comida caseira"],
  },
  {
    id: "oficina-rapida",
    name: "Oficina Rápida",
    category: "servicos",
    neighborhood: "Vila Esperança",
    distance: "1,1 km",
    hours: "Aberto até 18h",
    description: "Mecânica geral, troca de óleo, freios e suspensão. Orçamento sem compromisso.",
    offer: "Revisão de freios com orçamento grátis",
    whatsapp: "5511999990077",
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop",
    tags: ["mecânica", "freios", "revisão"],
  },
  {
    id: "hortifruti-da-praca",
    name: "Hortifruti da Praça",
    category: "mercado",
    neighborhood: "Vila Esperança",
    distance: "250 m",
    hours: "Aberto até 19h",
    description: "Frutas, verduras e legumes frescos direto do produtor. Entrega no bairro via WhatsApp.",
    offer: "Sacolão de frutas da estação por R$ 25",
    whatsapp: "5511999990088",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
    tags: ["frutas", "verduras", "hortifruti"],
  },
  {
    id: "sapataria-sao-jorge",
    name: "Sapataria São Jorge",
    category: "servicos",
    neighborhood: "Vila Esperança",
    distance: "500 m",
    hours: "Aberto até 18h",
    description: "Conserto de calçados, bolsas e cintos. Trabalho artesanal com garantia de qualidade.",
    offer: "Troca de sola com 10% off",
    whatsapp: "5511999990099",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400&h=300&fit=crop",
    tags: ["sapato", "conserto", "couro"],
  },
  {
    id: "loja-mimo-casa",
    name: "Loja Mimo & Casa",
    category: "comercio",
    neighborhood: "Vila Esperança",
    distance: "900 m",
    hours: "Aberto até 19h",
    description: "Presentes criativos, decoração e utilidades para o lar. Embalagem para presente grátis.",
    offer: "Kit presente a partir de R$ 29",
    whatsapp: "5511999990100",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    tags: ["presente", "decoração", "casa"],
  },
];

export const aiSuggestions: Record<string, { description: string; offer: string }> = {
  alimentacao: {
    description: "Sabores caseiros preparados com ingredientes frescos e muito carinho. Venha experimentar!",
    offer: "Combo especial do dia com desconto para vizinhos do bairro",
  },
  mercado: {
    description: "Tudo que você precisa para o dia a dia, pertinho de casa e com preço justo.",
    offer: "Promoção relâmpago: leve 3 e pague 2 em produtos selecionados",
  },
  beleza: {
    description: "Cuide da sua beleza com profissionais experientes e produtos de qualidade.",
    offer: "Primeira visita com 20% de desconto em qualquer serviço",
  },
  pet: {
    description: "Seu pet merece o melhor! Cuidamos dele com carinho e profissionalismo.",
    offer: "Banho + tosa com brinde especial para novos clientes",
  },
  servicos: {
    description: "Serviço rápido, confiável e com garantia. Seu problema resolvido no mesmo dia.",
    offer: "Orçamento grátis e 10% de desconto na primeira visita",
  },
  comercio: {
    description: "Produtos selecionados com qualidade e preço acessível para toda a família.",
    offer: "Frete grátis para entregas no bairro acima de R$ 50",
  },
};
