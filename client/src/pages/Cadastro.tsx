import { useState } from "react";
import { Sparkles, Store, CheckCircle2, MessageCircle, MapPin, Clock, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories, aiSuggestions } from "@/data/businesses";
import { toast } from "sonner";

interface FormData {
  name: string;
  category: string;
  neighborhood: string;
  whatsapp: string;
  hours: string;
  description: string;
  offer: string;
}

export default function Cadastro() {
  const [form, setForm] = useState<FormData>({
    name: "",
    category: "",
    neighborhood: "",
    whatsapp: "",
    hours: "",
    description: "",
    offer: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAiSuggest = () => {
    if (!form.category) {
      toast.error("Selecione uma categoria primeiro para a IA sugerir.");
      return;
    }
    setAiLoading(true);
    // Simulate AI delay
    setTimeout(() => {
      const suggestion = aiSuggestions[form.category];
      if (suggestion) {
        setForm((prev) => ({
          ...prev,
          description: prev.description || suggestion.description,
          offer: prev.offer || suggestion.offer,
        }));
        toast.success("IA gerou sugestões para você!");
      }
      setAiLoading(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.category || !form.whatsapp || !form.neighborhood || !form.hours) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    setSubmitted(true);
    toast.success("Vitrine cadastrada com sucesso!");
  };

  if (submitted) {
    const category = categories.find((c) => c.id === form.category);
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="container py-12 flex-1">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-foreground">
              Sua vitrine está pronta!
            </h1>
            <p className="mt-2 text-muted-foreground">
              Parabéns! Seu comércio já aparece para moradores do bairro.
            </p>

            {/* Preview card */}
            <div className="mt-8 max-w-sm mx-auto bg-card rounded-xl border border-border overflow-hidden shadow-md text-left">
              <div className="h-36 bg-gradient-to-br from-primary/20 to-[#EAB308]/20 flex items-center justify-center">
                <Store className="w-12 h-12 text-primary/50" />
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {category?.icon} {category?.label}
                  </span>
                  <h3 className="font-[var(--font-display)] font-semibold text-base text-foreground mt-1">
                    {form.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {form.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {form.neighborhood}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {form.hours}
                  </span>
                </div>
                {form.offer && (
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-[#EAB308]/10 rounded-lg">
                    <Tag className="w-3 h-3 text-[#EAB308]" />
                    <span className="text-xs font-semibold text-[#1C1917]">{form.offer}</span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#25D366] text-white text-sm font-semibold">
                  <MessageCircle className="w-4 h-4" />
                  Chamar no WhatsApp
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Os moradores do bairro <strong>{form.neighborhood}</strong> já podem encontrar você.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-10 flex-1">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-foreground">
              Cadastre seu comércio grátis
            </h1>
            <p className="mt-2 text-muted-foreground">
              Em menos de 2 minutos, sua vitrine estará pronta para o bairro.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Nome do comércio *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Padaria Sol Nascente"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Categoria *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Neighborhood */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Bairro *
              </label>
              <input
                type="text"
                name="neighborhood"
                value={form.neighborhood}
                onChange={handleChange}
                placeholder="Ex: Vila Esperança"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                WhatsApp (com DDD) *
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="Ex: 5511999999999"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {/* Hours */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Horário de funcionamento *
              </label>
              <input
                type="text"
                name="hours"
                value={form.hours}
                onChange={handleChange}
                placeholder="Ex: Seg a sáb, 7h às 19h"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {/* AI Suggestion button */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Sugestão da IA</span>
                </div>
                <button
                  type="button"
                  onClick={handleAiSuggest}
                  disabled={aiLoading}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {aiLoading ? "Gerando..." : "Gerar sugestão"}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Selecione a categoria e clique para a IA sugerir uma descrição e oferta para seu negócio.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Descrição curta
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descreva seu negócio em poucas palavras..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Offer */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Oferta do dia
              </label>
              <input
                type="text"
                name="offer"
                value={form.offer}
                onChange={handleChange}
                placeholder="Ex: Combo café + pão de queijo por R$ 9,90"
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity active:scale-[0.98] shadow-lg shadow-primary/20"
            >
              <Store className="w-5 h-5" />
              Criar minha vitrine grátis
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
