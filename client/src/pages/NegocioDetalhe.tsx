import { useParams, useLocation, Link } from "wouter";
import { ArrowLeft, MapPin, Clock, Tag, MessageCircle, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { businesses, categories } from "@/data/businesses";
import { toast } from "sonner";

export default function NegocioDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const business = businesses.find((b) => b.id === id);

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-[var(--font-display)] font-semibold text-lg">Comércio não encontrado</p>
            <button
              onClick={() => navigate("/negocios")}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Voltar para a lista
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = categories.find((c) => c.id === business.category);
  const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Olá, vi sua oferta no PertoZap e queria saber se ainda está disponível.")}`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `${business.offer} — ${business.name} no PertoZap`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copiado!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/negocios")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para comércios
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium">
                {category?.icon} {category?.label}
              </span>
            </div>

            {/* Info */}
            <div>
              <h1 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-foreground">
                {business.name}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {business.neighborhood} · {business.distance}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {business.hours}
                </span>
              </div>
              <p className="mt-4 text-foreground leading-relaxed">
                {business.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {business.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Offer card */}
              <div className="p-5 rounded-xl bg-[#EAB308]/10 border border-[#EAB308]/30">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="w-4 h-4 text-[#EAB308]" />
                  <span className="text-xs font-semibold text-[#EAB308] uppercase tracking-wide">
                    Oferta do bairro
                  </span>
                </div>
                <p className="font-[var(--font-display)] font-bold text-lg text-foreground">
                  {business.offer}
                </p>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#25D366] text-white font-semibold text-base hover:bg-[#20BD5A] transition-colors active:scale-[0.97] shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-5 h-5" />
                Quero essa oferta
              </a>

              <p className="text-xs text-center text-muted-foreground">
                Abre uma conversa no WhatsApp com mensagem pronta
              </p>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
