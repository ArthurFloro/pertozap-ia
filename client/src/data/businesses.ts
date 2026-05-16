export interface Business {
  id: string;
  name: string;
  category: string;
  neighborhood: string;
  lat: number;
  lng: number;
  hours: string;
  description: string;
  offer: string;
  cashbackRate: number; // moedas por R$1 gasto
  whatsapp: string;
  image: string;
  tags: string[];
}

export interface UserWallet {
  balance: number;
  totalEarned: number;
  level: "novo" | "frequente" | "fiel" | "embaixador";
  badges: string[];
  weeklyPurchases: number;
  distinctStores: number;
}

export const levels = {
  novo: { label: "Novo Vizinho", min: 0, max: 499, rate: 10, color: "#94A3B8" },
  frequente: { label: "Vizinho Frequente", min: 500, max: 1999, rate: 12, color: "#F59E0B" },
  fiel: { label: "Vizinho Fiel", min: 2000, max: 4999, rate: 15, color: "#10B981" },
  embaixador: { label: "Embaixador do Bairro", min: 5000, max: Infinity, rate: 20, color: "#8B5CF6" },
};

export const badges = [
  { id: "padeiro", label: "Padeiro", icon: "🍞", description: "5 compras em padarias", unlocked: true },
  { id: "explorador", label: "Explorador", icon: "🧭", description: "Comprou em 5 categorias", unlocked: true },
  { id: "madrugador", label: "Madrugador", icon: "🌅", description: "5 compras antes das 9h", unlocked: false },
  { id: "solidario", label: "Vizinho Solidário", icon: "🤝", description: "Indicou 3 pessoas", unlocked: false },
  { id: "fidelidade", label: "Fidelidade", icon: "⭐", description: "30 dias consecutivos", unlocked: false },
  { id: "economista", label: "Economista", icon: "💰", description: "Resgatou 500 moedas", unlocked: true },
];

export const weeklyChallenge = {
  title: "Compre em 3 comércios diferentes",
  reward: 50,
  progress: 2,
  total: 3,
  expiresIn: "3 dias",
};

export const categories = [
  { id: "alimentacao", label: "Alimentação", icon: "🍞" },
  { id: "mercado", label: "Mercado", icon: "🛒" },
  { id: "beleza", label: "Beleza", icon: "💇" },
  { id: "pet", label: "Pet", icon: "🐾" },
  { id: "servicos", label: "Serviços", icon: "🔧" },
  { id: "comercio", label: "Comércio", icon: "🛍️" },
];

// Vila Esperança area center: -23.525, -46.555
export const businesses: Business[] = [
  {
    id: "padaria-sol-nascente",
    name: "Padaria Sol Nascente",
    category: "alimentacao",
    neighborhood: "Vila Esperança",
    lat: -23.524,
    lng: -46.554,
    hours: "Aberto até 19h",
    description: "Pães artesanais, bolos caseiros e café fresquinho todos os dias. Tradição de família há 15 anos no bairro.",
    offer: "Café + pão de queijo por R$ 9,90",
    cashbackRate: 10,
    whatsapp: "5511999990011",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    tags: ["café", "pães", "bolo"],
  },
  {
    id: "mercado-bom-vizinho",
    name: "Mercado Bom Vizinho",
    category: "mercado",
    neighborhood: "Vila Esperança",
    lat: -23.527,
    lng: -46.558,
    hours: "Aberto até 21h",
    description: "Seu mercadinho de confiança com frutas frescas, produtos de limpeza e tudo para o dia a dia.",
    offer: "Cesta básica com 8 itens em promoção",
    cashbackRate: 8,
    whatsapp: "5511999990022",
    image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400&h=300&fit=crop",
    tags: ["mercado", "frutas", "cesta básica"],
  },
  {
    id: "bella-flor-cabelos",
    name: "Bella Flor Cabelos",
    category: "beleza",
    neighborhood: "Vila Esperança",
    lat: -23.523,
    lng: -46.556,
    hours: "Aberto até 18h",
    description: "Salão especializado em cabelos cacheados e crespos. Atendimento com hora marcada.",
    offer: "Escova com hidratação por R$ 49",
    cashbackRate: 12,
    whatsapp: "5511999990033",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop",
    tags: ["cabelo", "hidratação", "escova"],
  },
  {
    id: "pet-amigo",
    name: "Pet Amigo",
    category: "pet",
    neighborhood: "Vila Esperança",
    lat: -23.529,
    lng: -46.552,
    hours: "Aberto até 20h",
    description: "Banho, tosa, ração premium e acessórios para seu melhor amigo. Veterinário disponível.",
    offer: "Banho pequeno porte com 15% off",
    cashbackRate: 10,
    whatsapp: "5511999990044",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
    tags: ["pet", "banho", "ração"],
  },
  {
    id: "papelaria-criativa",
    name: "Papelaria Criativa",
    category: "servicos",
    neighborhood: "Vila Esperança",
    lat: -23.522,
    lng: -46.553,
    hours: "Aberto até 17h30",
    description: "Impressão, encadernação, material escolar e presentes criativos. Xerox a partir de R$ 0,15.",
    offer: "Impressão colorida com 20% de desconto",
    cashbackRate: 10,
    whatsapp: "5511999990055",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
    tags: ["impressão", "papelaria", "xerox"],
  },
  {
    id: "marmitaria-dona-lucia",
    name: "Marmitaria Dona Lúcia",
    category: "alimentacao",
    neighborhood: "Vila Esperança",
    lat: -23.526,
    lng: -46.560,
    hours: "Aberto até 14h30",
    description: "Comida caseira feita com carinho. Cardápio variado todos os dias, com opção fitness.",
    offer: "Marmita do dia por R$ 18",
    cashbackRate: 10,
    whatsapp: "5511999990066",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    tags: ["marmita", "almoço", "comida caseira"],
  },
  {
    id: "oficina-rapida",
    name: "Oficina Rápida",
    category: "servicos",
    neighborhood: "Jardim Popular",
    lat: -23.531,
    lng: -46.549,
    hours: "Aberto até 18h",
    description: "Mecânica geral, troca de óleo, freios e suspensão. Orçamento sem compromisso.",
    offer: "Revisão de freios com orçamento grátis",
    cashbackRate: 8,
    whatsapp: "5511999990077",
    image: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&h=300&fit=crop",
    tags: ["mecânica", "freios", "revisão"],
  },
  {
    id: "hortifruti-da-praca",
    name: "Hortifruti da Praça",
    category: "mercado",
    neighborhood: "Vila Esperança",
    lat: -23.521,
    lng: -46.555,
    hours: "Aberto até 19h",
    description: "Frutas, verduras e legumes frescos direto do produtor. Entrega no bairro via WhatsApp.",
    offer: "Sacolão de frutas da estação por R$ 25",
    cashbackRate: 10,
    whatsapp: "5511999990088",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop",
    tags: ["frutas", "verduras", "hortifruti"],
  },
  {
    id: "sapataria-sao-jorge",
    name: "Sapataria São Jorge",
    category: "servicos",
    neighborhood: "Jardim Popular",
    lat: -23.530,
    lng: -46.562,
    hours: "Aberto até 18h",
    description: "Conserto de calçados, bolsas e cintos. Trabalho artesanal com garantia de qualidade.",
    offer: "Troca de sola com 10% off",
    cashbackRate: 10,
    whatsapp: "5511999990099",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400&h=300&fit=crop",
    tags: ["sapato", "conserto", "couro"],
  },
  {
    id: "loja-mimo-casa",
    name: "Loja Mimo & Casa",
    category: "comercio",
    neighborhood: "Vila Matilde",
    lat: -23.533,
    lng: -46.545,
    hours: "Aberto até 19h",
    description: "Presentes criativos, decoração e utilidades para o lar. Embalagem para presente grátis.",
    offer: "Kit presente a partir de R$ 29",
    cashbackRate: 12,
    whatsapp: "5511999990100",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    tags: ["presente", "decoração", "casa"],
  },
];

export const neighborhoods = [
  "Vila Esperança",
  "Jardim Popular",
  "Vila Matilde",
  "Penha",
  "Vila Ré",
];

export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function calculateCoins(amount: number, level: keyof typeof levels): number {
  return Math.floor(amount * levels[level].rate);
}
