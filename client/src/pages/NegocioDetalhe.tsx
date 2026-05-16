import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, MapPin, Clock, Coins, MessageCircle, Share2, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { businesses, categories, levels } from "@/data/businesses";
import { useWallet } from "@/contexts/WalletContext";
import { toast } from "sonner";

export default function NegocioDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const business = businesses.find((b) => b.id === id);
  const { wallet, earnCoins, spendCoins } = useWallet();
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [redeemAmount, setRedeemAmount] = useState("");
  const [showEarnSuccess, setShowEarnSuccess] = useState(false);

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-[var(--font-display)] font-semibold text-lg">Comércio não encontrado</p>
            <button onClick={() => navigate("/negocios")} className="mt-4 text-sm text-primary hover:underline">
              Voltar para a lista
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = categories.find((c) => c.id === business.category);
  const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Olá! Vi sua oferta no Moeda do Bairro e quero saber mais.")}`;
  const currentLevel = levels[wallet.level];

  const handleEarn = () => {
    const amount = parseFloat(purchaseAmount);
    if (!amount || amount <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }
    if (amount > 500) {
      toast.error("Limite diário: R$ 500 por transação.");
      return;
    }
    earnCoins(amount);
    const earned = Math.floor(amount * currentLevel.rate);
    setShowEarnSuccess(true);
    toast.success(`+${earned} moedas ganhas!`);
    setPurchaseAmount("");
    setTimeout(() => setShowEarnSuccess(false), 3000);
  };

  const handleRedeem = () => {
    const coins = parseInt(redeemAmount);
    if (!coins || coins <= 0) {
      toast.error("Informe a quantidade de moedas.");
      return;
    }
    if (coins > wallet.balance) {
      toast.error("Saldo insuficiente.");
      return;
    }
    const maxRedeem = Math.floor(parseFloat(purchaseAmount || "100") * 50); // max 50% da compra
    if (coins > maxRedeem && purchaseAmount) {
      toast.error("Máximo 50% do valor da compra em moedas.");
      return;
    }
    const success = spendCoins(coins);
    if (success) {
      toast.success(`${coins} moedas resgatadas! Desconto de R$ ${(coins / 100).toFixed(2)}`);
      setRedeemAmount("");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `${business.offer} — ganhe ${business.cashbackRate} moedas/R$1 no Moeda do Bairro`,
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
            <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
              <img src={business.image} alt={business.name} className="w-full h-full object-cover" />
              <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium">
                {category?.icon} {category?.label}
              </span>
              <span className="absolute top-4 right-4 px-3 py-1.5 bg-[#F59E0B]/95 backdrop-blur-sm rounded-lg text-sm font-bold text-[#1C1917] flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                {business.cashbackRate} moedas/R$1
              </span>
            </div>

            <div>
              <h1 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-foreground">
                {business.name}
              </h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {business.neighborhood}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {business.hours}
                </span>
              </div>
              <p className="mt-4 text-foreground leading-relaxed">{business.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {business.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Offer card */}
              <div className="p-5 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">Oferta do bairro</p>
                <p className="font-[var(--font-display)] font-bold text-lg text-foreground mt-1">
                  {business.offer}
                </p>
              </div>

              {/* Earn coins simulator */}
              <div className="p-5 rounded-xl bg-card border border-border space-y-3">
                <h4 className="font-[var(--font-display)] font-semibold text-sm text-foreground flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#F59E0B]" />
                  Simular cashback
                </h4>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                    <input
                      type="number"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      placeholder="0,00"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <button
                    onClick={handleEarn}
                    className="px-4 py-2.5 rounded-lg bg-[#F59E0B] text-[#1C1917] text-sm font-semibold hover:bg-[#D97706] transition-colors active:scale-[0.97]"
                  >
                    Ganhar
                  </button>
                </div>
                {purchaseAmount && parseFloat(purchaseAmount) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Você ganharia <strong className="text-[#F59E0B]">{Math.floor(parseFloat(purchaseAmount) * currentLevel.rate)} moedas</strong> (nível {currentLevel.label})
                  </p>
                )}
                {showEarnSuccess && (
                  <div className="flex items-center gap-2 text-xs text-[#10B981] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Moedas creditadas na sua carteira!
                  </div>
                )}
              </div>

              {/* Redeem coins */}
              <div className="p-5 rounded-xl bg-card border border-border space-y-3">
                <h4 className="font-[var(--font-display)] font-semibold text-sm text-foreground flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#8B5CF6]" />
                  Resgatar moedas
                </h4>
                <p className="text-xs text-muted-foreground">
                  Saldo: <strong>{wallet.balance} moedas</strong> (R$ {(wallet.balance / 100).toFixed(2)})
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    placeholder="Qtd de moedas"
                    className="flex-1 px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    onClick={handleRedeem}
                    className="px-4 py-2.5 rounded-lg bg-[#8B5CF6] text-white text-sm font-semibold hover:bg-[#7C3AED] transition-colors active:scale-[0.97]"
                  >
                    Resgatar
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Máximo 50% do valor da compra. Código de 4 dígitos confirma a transação.
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
                Falar com o comerciante
              </a>

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
