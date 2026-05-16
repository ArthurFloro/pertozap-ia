import { useState } from "react";
import { Store, Coins, CheckCircle2, Sparkles, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories } from "@/data/businesses";
import { toast } from "sonner";

const cashbackOptions = [
  { rate: 8, label: "8 moedas/R$1", description: "Conservador" },
  { rate: 10, label: "10 moedas/R$1", description: "Padrão" },
  { rate: 12, label: "12 moedas/R$1", description: "Agressivo" },
  { rate: 15, label: "15 moedas/R$1", description: "Premium" },
];

export default function Cadastro() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    neighborhood: "",
    whatsapp: "",
    description: "",
    offer: "",
    cashbackRate: 10,
  });
  const [submitted, setSubmitted] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAISuggestion = () => {
    if (!form.name || !form.category) {
      toast.error("Preencha o nome e a categoria primeiro.");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      const suggestions: Record<string, { desc: string; offer: string }> = {
        alimentacao: {
          desc: `${form.name} é referência no bairro em comida de qualidade. Ingredientes frescos, preparo artesanal e atendimento que faz você se sentir em casa.`,
          offer: "Combo do dia com bebida grátis",
        },
        mercado: {
          desc: `No ${form.name} você encontra tudo para o dia a dia com preço justo. Frutas frescas, produtos de limpeza e aquele atendimento de vizinho.`,
          offer: "Cesta com 5 itens essenciais por R$ 29,90",
        },
        beleza: {
          desc: `${form.name} cuida da sua autoestima com profissionais qualificados e produtos de primeira linha. Agende pelo WhatsApp!`,
          offer: "Primeiro serviço com 20% de desconto",
        },
        pet: {
          desc: `Seu pet merece o melhor! ${form.name} oferece banho, tosa e produtos premium com muito carinho e cuidado.`,
          offer: "Banho + tosa com 15% off na primeira visita",
        },
        servicos: {
          desc: `${form.name} resolve seu problema com rapidez e qualidade. Profissionais experientes e orçamento sem compromisso.`,
          offer: "Orçamento grátis + 10% off no primeiro serviço",
        },
        comercio: {
          desc: `${form.name} tem os melhores produtos para você e sua casa. Variedade, qualidade e preço que cabe no bolso.`,
          offer: "Compre 2 e leve 3 em itens selecionados",
        },
      };
      const suggestion = suggestions[form.category] || suggestions.comercio;
      setForm((prev) => ({
        ...prev,
        description: suggestion.desc,
        offer: suggestion.offer,
      }));
      setGenerating(false);
      toast.success("Sugestão gerada com IA!");
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.whatsapp) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    setSubmitted(true);
    toast.success("Cadastro enviado com sucesso!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="text-center max-w-md px-4">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
            </div>
            <h2 className="font-[var(--font-display)] text-2xl font-bold text-foreground">
              Bem-vindo à Moeda do Bairro!
            </h2>
            <p className="text-muted-foreground mt-3">
              Seu comércio <strong>{form.name}</strong> foi cadastrado com cashback de <strong>{form.cashbackRate} moedas/R$1</strong>. Em breve seus clientes poderão ganhar moedas comprando com você.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-left">
              <p className="text-sm font-semibold text-foreground">Próximos passos:</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li>✓ Divulgue para seus clientes</li>
                <li>✓ Use o código de 4 dígitos para confirmar transações</li>
                <li>✓ Acompanhe seus clientes fiéis pelo painel</li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Store className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-foreground">
            Cadastre seu comércio
          </h1>
          <p className="text-muted-foreground mt-2">
            Ofereça cashback em moedas e fidelize seus clientes sem custo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Nome do comércio *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ex: Padaria Sol Nascente"
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Categoria *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleChange("category", cat.id)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-center transition-all ${
                    form.category === cat.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Neighborhood + WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Bairro</label>
              <input
                type="text"
                value={form.neighborhood}
                onChange={(e) => handleChange("neighborhood", e.target.value)}
                placeholder="Ex: Vila Esperança"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">WhatsApp *</label>
              <input
                type="tel"
                value={form.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="(11) 99999-0000"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Cashback rate */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-2">
              <Coins className="w-4 h-4 text-[#F59E0B]" />
              Taxa de cashback que você oferece
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {cashbackOptions.map((opt) => (
                <button
                  key={opt.rate}
                  type="button"
                  onClick={() => handleChange("cashbackRate", opt.rate)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    form.cashbackRate === opt.rate
                      ? "border-[#F59E0B] bg-[#F59E0B]/5 ring-2 ring-[#F59E0B]/30"
                      : "border-border bg-card hover:border-[#F59E0B]/50"
                  }`}
                >
                  <p className="text-sm font-bold text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Com {form.cashbackRate} moedas/R$1, uma compra de R$ 50 dá {form.cashbackRate * 50} moedas ao cliente (= R$ {((form.cashbackRate * 50) / 100).toFixed(2)} em desconto futuro).
            </p>
          </div>

          {/* AI suggestion */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
            <Sparkles className="w-5 h-5 text-[#F59E0B] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Gerar descrição e oferta com IA</p>
              <p className="text-xs text-muted-foreground">Preencha nome e categoria primeiro.</p>
            </div>
            <button
              type="button"
              onClick={handleAISuggestion}
              disabled={generating}
              className="px-4 py-2 rounded-lg bg-[#F59E0B] text-[#1C1917] text-xs font-semibold hover:bg-[#D97706] transition-colors disabled:opacity-50"
            >
              {generating ? "Gerando..." : "Gerar"}
            </button>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Descrição</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Conte sobre seu negócio..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Offer */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Oferta em destaque</label>
            <input
              type="text"
              value={form.offer}
              onChange={(e) => handleChange("offer", e.target.value)}
              placeholder="Ex: Café + pão de queijo por R$ 9,90"
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Security info */}
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
            <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Como funciona para o comerciante:</p>
              <p>Cada transação é confirmada com código de 4 dígitos que você gera. Limite de 500 moedas/dia por cliente. Cooldown de 30 min entre transações no mesmo comércio.</p>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-accent text-accent-foreground font-semibold text-base hover:opacity-90 transition-all active:scale-[0.98] shadow-lg shadow-accent/20"
          >
            Cadastrar meu comércio grátis
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
