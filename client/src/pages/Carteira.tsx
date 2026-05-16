import { useState } from "react";
import { Coins, Trophy, Target, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWallet } from "@/contexts/WalletContext";
import { levels, badges as allBadges, weeklyChallenge } from "@/data/businesses";

const mockHistory = [
  { id: 1, type: "earn" as const, amount: 45, store: "Padaria Sol Nascente", date: "Hoje, 08:32" },
  { id: 2, type: "earn" as const, amount: 96, store: "Mercado Bom Vizinho", date: "Hoje, 11:15" },
  { id: 3, type: "redeem" as const, amount: 100, store: "Bella Flor Cabelos", date: "Ontem, 15:40" },
  { id: 4, type: "earn" as const, amount: 30, store: "Papelaria Criativa", date: "Ontem, 09:20" },
  { id: 5, type: "bonus" as const, amount: 50, store: "Desafio semanal concluído", date: "Seg, 18:00" },
  { id: 6, type: "earn" as const, amount: 120, store: "Hortifruti da Praça", date: "Seg, 10:45" },
];

export default function Carteira() {
  const { wallet } = useWallet();
  const currentLevel = levels[wallet.level];
  const [tab, setTab] = useState<"resumo" | "historico">("resumo");

  const nextLevel = wallet.level === "embaixador"
    ? null
    : wallet.level === "fiel"
    ? levels.embaixador
    : wallet.level === "frequente"
    ? levels.fiel
    : levels.frequente;

  const progressPercent = nextLevel
    ? Math.min(((wallet.totalEarned - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100, 100)
    : 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-6 max-w-2xl mx-auto">
        {/* Balance card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1C1917] to-[#44403C] text-white">
          <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Saldo disponível</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-[var(--font-display)] font-bold text-[#F59E0B]">
              {wallet.balance}
            </span>
            <span className="text-lg text-white/50">moedas</span>
          </div>
          <p className="text-sm text-white/50 mt-1">
            = R$ {(wallet.balance / 100).toFixed(2)} em desconto
          </p>

          {/* Level progress */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold" style={{ color: currentLevel.color }}>
                {currentLevel.label}
              </span>
              {nextLevel && (
                <span className="text-white/40">
                  Próximo: {nextLevel.label}
                </span>
              )}
            </div>
            <div className="mt-2 h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%`, backgroundColor: currentLevel.color }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-white/40">
              <span>{wallet.totalEarned} moedas acumuladas</span>
              {nextLevel && <span>Meta: {nextLevel.min}</span>}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-lg font-bold text-white">{wallet.weeklyPurchases}</p>
              <p className="text-xs text-white/40">Compras esta semana</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-lg font-bold text-white">{wallet.distinctStores}</p>
              <p className="text-xs text-white/40">Comércios visitados</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/5">
              <p className="text-lg font-bold text-white">{currentLevel.rate}x</p>
              <p className="text-xs text-white/40">Moedas/R$1</p>
            </div>
          </div>
        </div>

        {/* Weekly challenge */}
        <div className="mt-6 p-5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-[#F59E0B] uppercase tracking-wide">Desafio da semana</p>
              <p className="font-[var(--font-display)] font-semibold text-foreground mt-1">
                {weeklyChallenge.title}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-[#F59E0B]/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full"
                    style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground">
                  {weeklyChallenge.progress}/{weeklyChallenge.total}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Expira em {weeklyChallenge.expiresIn} • Recompensa: +{weeklyChallenge.reward} moedas
              </p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-6">
          <h3 className="font-[var(--font-display)] font-semibold text-base text-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            Suas conquistas
          </h3>
          <div className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
            {allBadges.map((badge) => {
              const unlocked = wallet.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                    unlocked
                      ? "bg-card border-primary/30 shadow-sm"
                      : "bg-muted/50 border-border opacity-50"
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-xs font-medium text-foreground mt-1">{badge.label}</span>
                  {!unlocked && (
                    <span className="text-[10px] text-muted-foreground mt-0.5">🔒</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
            <button
              onClick={() => setTab("resumo")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === "resumo" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Resumo
            </button>
            <button
              onClick={() => setTab("historico")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === "historico" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Histórico
            </button>
          </div>

          {tab === "historico" && (
            <div className="mt-4 space-y-2">
              {mockHistory.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.type === "earn" ? "bg-[#10B981]/10" : item.type === "bonus" ? "bg-[#F59E0B]/10" : "bg-[#8B5CF6]/10"
                  }`}>
                    {item.type === "earn" ? (
                      <ArrowDownRight className="w-4 h-4 text-[#10B981]" />
                    ) : item.type === "bonus" ? (
                      <Trophy className="w-4 h-4 text-[#F59E0B]" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-[#8B5CF6]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.store}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${
                    item.type === "redeem" ? "text-[#8B5CF6]" : "text-[#10B981]"
                  }`}>
                    {item.type === "redeem" ? "-" : "+"}{item.amount}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab === "resumo" && (
            <div className="mt-4 p-5 rounded-xl bg-card border border-border space-y-4">
              <h4 className="font-[var(--font-display)] font-semibold text-sm text-foreground">
                Como usar suas moedas
              </h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Ganhar:</strong> A cada compra em comércios participantes, você recebe moedas automaticamente. No seu nível atual ({currentLevel.label}), você ganha <strong>{currentLevel.rate} moedas por R$ 1</strong> gasto.
                </p>
                <p>
                  <strong className="text-foreground">Resgatar:</strong> Use suas moedas como desconto em qualquer comércio participante. 100 moedas = R$ 1,00 de desconto. Máximo de 50% do valor da compra.
                </p>
                <p>
                  <strong className="text-foreground">Segurança:</strong> Cada transação é confirmada com um código de 4 dígitos gerado pelo comerciante. Limite de 500 moedas/dia e cooldown de 30 min entre transações no mesmo local.
                </p>
                <p>
                  <strong className="text-foreground">Validade:</strong> Moedas expiram após 90 dias sem uso. Mantenha-se ativo para não perder!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
