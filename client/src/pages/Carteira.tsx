// ============================================================
// MOEDA DO BAIRRO — Carteira do Cliente
// Saldo, QR de resgate, histórico, gamificação e regras
// ============================================================
import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Coins, QrCode, Trophy, Shield, Clock, TrendingUp, CheckCircle2, XCircle, Gift, Star, Target } from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { levels, badges as allBadges, weeklyChallenge, RULES, formatCoinsToReais, businesses } from "@/data/businesses";
import { toast } from "sonner";

export default function Carteira() {
  const [, navigate] = useLocation();
  const { wallet, transactions, generateRedemptionQR, activeQR, confirmTransaction, cancelTransaction, getLevel, getDailyCoinsEarned } = useWallet();
  const [activeTab, setActiveTab] = useState<"resumo" | "historico" | "resgatar">("resumo");
  const [redeemAmount, setRedeemAmount] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState(businesses[0].id);
  const [showQR, setShowQR] = useState(false);

  const currentLevel = getLevel();
  const nextLevel = wallet.level === "novo" ? levels.frequente :
    wallet.level === "frequente" ? levels.fiel :
    wallet.level === "fiel" ? levels.embaixador : null;

  const progressPercent = nextLevel
    ? Math.min(((wallet.totalEarned - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100, 100)
    : 100;

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
    const merchant = businesses.find(b => b.id === selectedMerchant);
    if (!merchant) return;

    generateRedemptionQR(merchant.id, merchant.name, coins);
    setShowQR(true);
    toast.success("QR de resgate gerado! Mostre ao comerciante.");
  };

  const handleMerchantConfirm = () => {
    confirmTransaction("merchant");
    setShowQR(false);
    setRedeemAmount("");
    toast.success("Resgate confirmado! Moedas debitadas.");
  };

  const handleCancelRedeem = () => {
    cancelTransaction();
    setShowQR(false);
    setRedeemAmount("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 container py-6 max-w-2xl mx-auto">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-[var(--font-display)] text-xl font-bold text-foreground">Minha Carteira</h1>
        </div>

        {/* Balance card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C1917] to-[#44403C] text-white mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Saldo disponível</p>
              <p className="text-4xl font-[var(--font-display)] font-bold text-[#F59E0B] mt-1">
                {wallet.balance}
              </p>
              <p className="text-sm text-white/50 mt-0.5">
                = {formatCoinsToReais(wallet.balance)}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${currentLevel.color}20`, color: currentLevel.color }}>
                <Star className="w-3 h-3" />
                {currentLevel.label}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          {nextLevel && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-white/50 mb-1.5">
                <span>{wallet.totalEarned} moedas acumuladas</span>
                <span>{nextLevel.label} em {nextLevel.min - wallet.totalEarned}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: currentLevel.color,
                  }}
                />
              </div>
            </div>
          )}

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="p-2 rounded-lg bg-white/5 text-center">
              <p className="text-xs text-white/50">Hoje</p>
              <p className="text-sm font-bold text-white">{getDailyCoinsEarned()}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5 text-center">
              <p className="text-xs text-white/50">Resgatado</p>
              <p className="text-sm font-bold text-white">{wallet.totalRedeemed}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5 text-center">
              <p className="text-xs text-white/50">Lojas</p>
              <p className="text-sm font-bold text-white">{wallet.distinctStores}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted mb-6">
          {[
            { id: "resumo" as const, label: "Resumo" },
            { id: "resgatar" as const, label: "Usar moedas" },
            { id: "historico" as const, label: "Histórico" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "resumo" && (
          <div className="space-y-4">
            {/* Weekly challenge */}
            <div className="p-5 rounded-xl bg-[#F59E0B]/5 border border-[#F59E0B]/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#F59E0B]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wide">Desafio da semana</p>
                  <p className="font-[var(--font-display)] font-semibold text-foreground text-sm mt-1">
                    {weeklyChallenge.title}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-[#F59E0B]/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F59E0B] rounded-full"
                        style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">
                      {weeklyChallenge.progress}/{weeklyChallenge.total}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Expira em {weeklyChallenge.expiresIn} • Recompensa: +{weeklyChallenge.reward} moedas
                  </p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#F59E0B]" />
                Suas conquistas
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {allBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center text-center p-2 rounded-lg ${
                      badge.unlocked || wallet.badges.includes(badge.id)
                        ? "bg-[#F59E0B]/5"
                        : "bg-muted/50 opacity-50"
                    }`}
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span className="text-[10px] font-medium text-foreground mt-1">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="p-5 rounded-xl bg-card border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#10B981]" />
                Regras e segurança
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  <span>Máximo {RULES.MAX_COINS_PER_DAY_CLIENT} moedas por dia</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  <span>Cooldown de {RULES.COOLDOWN_MINUTES} min entre transações no mesmo comércio</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  <span>QR Code expira em {RULES.QR_EXPIRY_MINUTES} minutos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  <span>Resgate máximo de {RULES.MAX_REDEEM_PERCENT}% do valor da compra</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  <span>Moedas expiram após {RULES.COINS_EXPIRY_DAYS} dias sem uso</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  <span>Confirmação bilateral obrigatória (comerciante + cliente)</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "resgatar" && (
          <div className="space-y-4">
            {!showQR ? (
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 mx-auto rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-3">
                    <QrCode className="w-7 h-7 text-[#10B981]" />
                  </div>
                  <h2 className="font-[var(--font-display)] text-lg font-bold text-foreground">
                    Usar moedas como desconto
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gere um QR Code e mostre ao comerciante
                  </p>
                </div>

                {/* Select merchant */}
                <label className="block text-xs font-medium text-foreground mb-1.5">Comércio</label>
                <select
                  value={selectedMerchant}
                  onChange={(e) => setSelectedMerchant(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] mb-4"
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>

                {/* Amount */}
                <label className="block text-xs font-medium text-foreground mb-1.5">Moedas a usar</label>
                <div className="relative mb-2">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F59E0B]" />
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Ex: 200"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted/30 text-base focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>

                {redeemAmount && parseInt(redeemAmount) > 0 && (
                  <p className="text-xs text-muted-foreground mb-4">
                    = {formatCoinsToReais(parseInt(redeemAmount))} de desconto
                  </p>
                )}

                <p className="text-xs text-muted-foreground mb-4">
                  Saldo: <span className="font-semibold text-[#F59E0B]">{wallet.balance} moedas</span> ({formatCoinsToReais(wallet.balance)})
                </p>

                <button
                  onClick={handleGenerateRedeemQR}
                  className="w-full py-3.5 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-colors active:scale-[0.97]"
                >
                  Gerar QR de Resgate
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-card border border-[#10B981]/30 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#10B981]/10 flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-[#10B981] animate-pulse" />
                </div>
                <h2 className="font-[var(--font-display)] text-lg font-bold text-foreground">
                  QR de Resgate
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Mostre ao comerciante para confirmar
                </p>

                {/* Simulated QR */}
                <div className="mt-5 p-5 rounded-2xl bg-white border-2 border-dashed border-[#10B981]/30 inline-block">
                  <div className="w-40 h-40 bg-[#1C1917] rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-3 grid grid-cols-7 grid-rows-7 gap-0.5">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${Math.random() > 0.45 ? "bg-white" : "bg-transparent"}`}
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-lg bg-[#10B981] flex items-center justify-center">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {activeQR && (
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Moedas:</span>
                      <span className="font-bold text-[#10B981]">{activeQR.coinsToRedeem}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Desconto:</span>
                      <span className="font-bold">{formatCoinsToReais(activeQR.coinsToRedeem || 0)}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-muted-foreground">Expira em:</span>
                      <span className="font-medium text-destructive">{RULES.QR_EXPIRY_MINUTES} min</span>
                    </div>
                  </div>
                )}

                {/* Simulate merchant confirmation */}
                <button
                  onClick={handleMerchantConfirm}
                  className="mt-4 w-full py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-colors active:scale-[0.97]"
                >
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Simular: Comerciante confirmou
                  </span>
                </button>
                <button
                  onClick={handleCancelRedeem}
                  className="mt-2 w-full py-3 rounded-xl border border-destructive/30 text-destructive font-medium hover:bg-destructive/5 transition-colors"
                >
                  <span className="flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Cancelar
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "historico" && (
          <div className="space-y-2">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Nenhuma transação ainda</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div key={tx.id} className="p-4 rounded-xl bg-card border border-border flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tx.type === "acumulo" ? "bg-[#F59E0B]/10" :
                    tx.type === "resgate" ? "bg-[#10B981]/10" :
                    tx.type === "bonus" ? "bg-[#8B5CF6]/10" : "bg-destructive/10"
                  }`}>
                    {tx.type === "acumulo" && <TrendingUp className="w-5 h-5 text-[#F59E0B]" />}
                    {tx.type === "resgate" && <Gift className="w-5 h-5 text-[#10B981]" />}
                    {tx.type === "bonus" && <Trophy className="w-5 h-5 text-[#8B5CF6]" />}
                    {tx.type === "expiracao" && <XCircle className="w-5 h-5 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{tx.merchantName}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.type === "acumulo" ? "Compra" : tx.type === "resgate" ? "Resgate" : tx.type === "bonus" ? "Bônus" : "Expiração"}
                      {tx.amount > 0 && ` • R$ ${tx.amount.toFixed(2)}`}
                      {tx.paymentMethod && ` • ${tx.paymentMethod}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString("pt-BR")} {new Date(tx.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      tx.type === "acumulo" || tx.type === "bonus" ? "text-[#F59E0B]" : "text-[#10B981]"
                    }`}>
                      {tx.type === "acumulo" || tx.type === "bonus" ? "+" : "-"}{tx.coins}
                    </p>
                    <p className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block ${
                      tx.status === "confirmada" ? "bg-[#10B981]/10 text-[#10B981]" :
                      tx.status === "pendente" ? "bg-[#F59E0B]/10 text-[#F59E0B]" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
