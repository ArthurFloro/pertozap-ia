// ============================================================
// MOEDA DO BAIRRO — Detalhe do Negócio
// Fluxo de acúmulo via QR + resgate + info do comércio
// ============================================================
import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, Coins, QrCode, Clock, MapPin, Phone, CheckCircle2, Shield, AlertTriangle, ExternalLink, Share2, MessageCircle, Gift } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWallet } from "@/contexts/WalletContext";
import { businesses, categories, RULES, formatCoinsToReais, calculateCoins, levels } from "@/data/businesses";
import { toast } from "sonner";

export default function NegocioDetalhe() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const business = businesses.find((b) => b.id === id);
  const { wallet, generateAccumulationQR, generateRedemptionQR, activeQR, confirmTransaction, cancelTransaction, canTransact } = useWallet();
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [redeemAmount, setRedeemAmount] = useState("");
  const [showEarnQR, setShowEarnQR] = useState(false);
  const [showRedeemQR, setShowRedeemQR] = useState(false);
  const [earnConfirmed, setEarnConfirmed] = useState(false);
  const [redeemConfirmed, setRedeemConfirmed] = useState(false);

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
  const transactCheck = canTransact(business.id);

  const coinsPreview = purchaseAmount && parseFloat(purchaseAmount) > 0
    ? calculateCoins(parseFloat(purchaseAmount), business.cashbackRate, wallet.level)
    : 0;

  const handleGenerateEarnQR = () => {
    const value = parseFloat(purchaseAmount);
    if (!value || value < 1) {
      toast.error("Valor mínimo é R$ 1,00");
      return;
    }
    if (value > 500) {
      toast.error("Valor máximo por transação é R$ 500,00");
      return;
    }
    if (!transactCheck.allowed) {
      toast.error(transactCheck.reason || "Transação não permitida");
      return;
    }
    generateAccumulationQR(business.id, business.name, value, business.cashbackRate);
    setShowEarnQR(true);
    toast.success("QR Code gerado! Aguardando confirmação bilateral.");
  };

  const handleConfirmEarn = () => {
    confirmTransaction("client");
    confirmTransaction("merchant");
    setShowEarnQR(false);
    setEarnConfirmed(true);
    setPurchaseAmount("");
    toast.success(`+${coinsPreview} moedas na sua carteira!`);
    setTimeout(() => setEarnConfirmed(false), 4000);
  };

  const handleGenerateRedeemQR = () => {
    const coins = parseInt(redeemAmount);
    if (!coins || coins < 10) {
      toast.error("Mínimo de 10 moedas para resgate");
      return;
    }
    if (coins > wallet.balance) {
      toast.error("Saldo insuficiente");
      return;
    }
    if (coins > RULES.MAX_REDEEM_PER_DAY) {
      toast.error(`Máximo de ${RULES.MAX_REDEEM_PER_DAY} moedas por dia`);
      return;
    }
    generateRedemptionQR(business.id, business.name, coins);
    setShowRedeemQR(true);
    toast.success("QR de resgate gerado! Mostre ao comerciante.");
  };

  const handleConfirmRedeem = () => {
    confirmTransaction("merchant");
    setShowRedeemQR(false);
    setRedeemConfirmed(true);
    setRedeemAmount("");
    toast.success("Resgate confirmado! Desconto aplicado.");
    setTimeout(() => setRedeemConfirmed(false), 4000);
  };

  const handleCancelQR = () => {
    cancelTransaction();
    setShowEarnQR(false);
    setShowRedeemQR(false);
    setPurchaseAmount("");
    setRedeemAmount("");
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
                {business.verified && (
                  <span className="flex items-center gap-1 text-[#10B981]">
                    <CheckCircle2 className="w-4 h-4" />
                    Verificado
                  </span>
                )}
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

            {/* Offer */}
            <div className="p-5 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Oferta do bairro</p>
              <p className="font-[var(--font-display)] font-bold text-lg text-foreground mt-1">
                {business.offer}
              </p>
            </div>
          </div>

          {/* Sidebar — QR Code flows */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">

              {/* ===== EARN COINS via QR ===== */}
              {!showEarnQR && !showRedeemQR && !earnConfirmed && !redeemConfirmed && (
                <>
                  <div className="p-5 rounded-xl bg-card border border-border space-y-3">
                    <h4 className="font-[var(--font-display)] font-semibold text-sm text-foreground flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#F59E0B]" />
                      Registrar compra (ganhar moedas)
                    </h4>

                    {!transactCheck.allowed && (
                      <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                        <p className="text-xs text-destructive flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          {transactCheck.reason}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
                        <input
                          type="number"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(e.target.value)}
                          placeholder="0,00"
                          inputMode="decimal"
                          className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/50"
                          disabled={!transactCheck.allowed}
                        />
                      </div>
                      <button
                        onClick={handleGenerateEarnQR}
                        disabled={!transactCheck.allowed}
                        className="px-4 py-2.5 rounded-lg bg-[#F59E0B] text-[#1C1917] text-sm font-semibold hover:bg-[#D97706] transition-colors active:scale-[0.97] disabled:opacity-50"
                      >
                        Gerar QR
                      </button>
                    </div>
                    {coinsPreview > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Você ganharia <strong className="text-[#F59E0B]">{coinsPreview} moedas</strong> (nível {currentLevel.label}, +{currentLevel.bonus}% bônus)
                      </p>
                    )}
                  </div>

                  {/* ===== REDEEM COINS via QR ===== */}
                  <div className="p-5 rounded-xl bg-card border border-border space-y-3">
                    <h4 className="font-[var(--font-display)] font-semibold text-sm text-foreground flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#10B981]" />
                      Usar moedas (desconto)
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Saldo: <strong>{wallet.balance} moedas</strong> ({formatCoinsToReais(wallet.balance)})
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={redeemAmount}
                        onChange={(e) => setRedeemAmount(e.target.value)}
                        placeholder="Qtd de moedas"
                        inputMode="numeric"
                        className="flex-1 px-3 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]/50"
                      />
                      <button
                        onClick={handleGenerateRedeemQR}
                        className="px-4 py-2.5 rounded-lg bg-[#10B981] text-white text-sm font-semibold hover:bg-[#059669] transition-colors active:scale-[0.97]"
                      >
                        Gerar QR
                      </button>
                    </div>
                    {redeemAmount && parseInt(redeemAmount) > 0 && (
                      <p className="text-xs text-muted-foreground">
                        = {formatCoinsToReais(parseInt(redeemAmount))} de desconto
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Máx. {RULES.MAX_REDEEM_PERCENT}% do valor da compra. Confirmação bilateral obrigatória.
                    </p>
                  </div>

                  {/* Security */}
                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="text-xs font-semibold text-foreground flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-[#10B981]" />
                      Segurança
                    </p>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• QR expira em {RULES.QR_EXPIRY_MINUTES} min</li>
                      <li>• Confirmação bilateral (cliente + comerciante)</li>
                      <li>• Máx. {RULES.MAX_COINS_PER_DAY_CLIENT} moedas/dia</li>
                      <li>• Cooldown: {RULES.COOLDOWN_MINUTES} min entre transações</li>
                    </ul>
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
                </>
              )}

              {/* ===== QR EARN GENERATED ===== */}
              {showEarnQR && activeQR && (
                <div className="p-6 rounded-2xl bg-card border border-[#F59E0B]/30 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#F59E0B]/10 flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-[#F59E0B] animate-pulse" />
                  </div>
                  <h3 className="font-[var(--font-display)] font-bold text-foreground">QR de Compra</h3>
                  <p className="text-xs text-muted-foreground mt-1">Aguardando confirmação bilateral</p>

                  <div className="mt-4 p-4 rounded-xl bg-white border border-border inline-block">
                    <div className="w-36 h-36 bg-[#1C1917] rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-2 grid grid-cols-7 grid-rows-7 gap-0.5">
                        {Array.from({ length: 49 }).map((_, i) => (
                          <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? "bg-white" : "bg-transparent"}`} />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-md bg-[#F59E0B] flex items-center justify-center">
                          <Coins className="w-4 h-4 text-[#1C1917]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-muted/50 text-xs text-left">
                    <div className="flex justify-between"><span className="text-muted-foreground">Valor:</span><span className="font-bold">R$ {activeQR.amount?.toFixed(2)}</span></div>
                    <div className="flex justify-between mt-1"><span className="text-muted-foreground">Moedas:</span><span className="font-bold text-[#F59E0B]">{activeQR.coinsToEarn}</span></div>
                    <div className="flex justify-between mt-1"><span className="text-muted-foreground">Expira:</span><span className="text-destructive">{RULES.QR_EXPIRY_MINUTES} min</span></div>
                  </div>

                  <button
                    onClick={handleConfirmEarn}
                    className="mt-4 w-full py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-colors active:scale-[0.97]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Confirmar transação
                    </span>
                  </button>
                  <button
                    onClick={handleCancelQR}
                    className="mt-2 w-full py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm hover:bg-destructive/5 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {/* ===== QR REDEEM GENERATED ===== */}
              {showRedeemQR && activeQR && (
                <div className="p-6 rounded-2xl bg-card border border-[#10B981]/30 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#10B981]/10 flex items-center justify-center mb-3">
                    <Clock className="w-6 h-6 text-[#10B981] animate-pulse" />
                  </div>
                  <h3 className="font-[var(--font-display)] font-bold text-foreground">QR de Resgate</h3>
                  <p className="text-xs text-muted-foreground mt-1">Mostre ao comerciante para confirmar</p>

                  <div className="mt-4 p-4 rounded-xl bg-white border border-border inline-block">
                    <div className="w-36 h-36 bg-[#1C1917] rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-2 grid grid-cols-7 grid-rows-7 gap-0.5">
                        {Array.from({ length: 49 }).map((_, i) => (
                          <div key={i} className={`rounded-sm ${Math.random() > 0.45 ? "bg-white" : "bg-transparent"}`} />
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-md bg-[#10B981] flex items-center justify-center">
                          <Gift className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-muted/50 text-xs text-left">
                    <div className="flex justify-between"><span className="text-muted-foreground">Moedas:</span><span className="font-bold text-[#10B981]">{activeQR.coinsToRedeem}</span></div>
                    <div className="flex justify-between mt-1"><span className="text-muted-foreground">Desconto:</span><span className="font-bold">{formatCoinsToReais(activeQR.coinsToRedeem || 0)}</span></div>
                    <div className="flex justify-between mt-1"><span className="text-muted-foreground">Expira:</span><span className="text-destructive">{RULES.QR_EXPIRY_MINUTES} min</span></div>
                  </div>

                  <button
                    onClick={handleConfirmRedeem}
                    className="mt-4 w-full py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-colors active:scale-[0.97]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Simular: Comerciante confirmou
                    </span>
                  </button>
                  <button
                    onClick={handleCancelQR}
                    className="mt-2 w-full py-2.5 rounded-xl border border-destructive/30 text-destructive text-sm hover:bg-destructive/5 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {/* ===== SUCCESS STATES ===== */}
              {earnConfirmed && (
                <div className="p-6 rounded-2xl bg-card border border-[#10B981]/30 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#10B981]/10 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                  </div>
                  <h3 className="font-[var(--font-display)] font-bold text-foreground">Moedas creditadas!</h3>
                  <p className="text-sm text-muted-foreground mt-1">Confira na sua carteira</p>
                  <button
                    onClick={() => setEarnConfirmed(false)}
                    className="mt-4 w-full py-3 rounded-xl bg-[#F59E0B] text-[#1C1917] font-bold hover:bg-[#D97706] transition-colors"
                  >
                    Voltar
                  </button>
                </div>
              )}

              {redeemConfirmed && (
                <div className="p-6 rounded-2xl bg-card border border-[#10B981]/30 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[#10B981]/10 flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                  </div>
                  <h3 className="font-[var(--font-display)] font-bold text-foreground">Desconto aplicado!</h3>
                  <p className="text-sm text-muted-foreground mt-1">Moedas debitadas da carteira</p>
                  <button
                    onClick={() => setRedeemConfirmed(false)}
                    className="mt-4 w-full py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-colors"
                  >
                    Voltar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
