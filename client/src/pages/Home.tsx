// ============================================================
// MOEDA DO BAIRRO — Home Page
// Design: Vitrine Comunitária com foco em QR Code e cashback bilateral
// ============================================================
import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ArrowRight, Coins, Store, QrCode, Shield, Zap, Smartphone, CheckCircle2, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { businesses, categories, RULES } from "@/data/businesses";
import { useWallet } from "@/contexts/WalletContext";

export default function Home() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { wallet } = useWallet();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/negocios?q=${encodeURIComponent(searchQuery)}`);
  };

  const featuredBusinesses = businesses.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#44403C]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#F59E0B] blur-3xl" />
          <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full bg-[#F59E0B] blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#10B981] blur-3xl opacity-30" />
        </div>

        <div className="container relative py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-semibold mb-6">
                <QrCode className="w-3.5 h-3.5" />
                QR Code + Confirmação Bilateral
              </div>
              <h1 className="font-[var(--font-display)] text-3xl md:text-5xl font-bold text-white leading-tight">
                Cashback via QR Code.<br />
                <span className="text-[#F59E0B]">Sem maquininha. Sem nota.</span>
              </h1>
              <p className="mt-4 text-lg text-white/75 max-w-lg">
                Comprou na padaria? Escaneie o QR, confirme a compra e ganhe moedas. Use como desconto em qualquer comércio do bairro. Simples assim.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="mt-8 flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar comércios no bairro..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-foreground text-base shadow-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-4 rounded-xl bg-[#F59E0B] text-[#1C1917] font-semibold text-sm hover:bg-[#D97706] transition-colors active:scale-[0.97] shadow-lg"
                >
                  Buscar
                </button>
              </form>

              {/* Quick stats */}
              <div className="mt-6 flex items-center gap-6 text-white/60 text-sm">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-[#F59E0B]" />
                  {RULES.COINS_PER_REAL} moedas = R$ 1
                </span>
                <span className="flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-[#10B981]" />
                  {businesses.length} comércios
                </span>
              </div>
            </div>

            {/* QR Code demo card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-sm ml-auto">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <QrCode className="w-8 h-8 text-[#F59E0B]" />
                  </div>
                  <p className="text-white font-semibold text-sm">Fluxo de Compra</p>
                  <div className="mt-4 space-y-3 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#F59E0B] text-xs font-bold">1</span>
                      </div>
                      <p className="text-white/70 text-xs">Comerciante digita o valor e gera QR</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#F59E0B]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#F59E0B] text-xs font-bold">2</span>
                      </div>
                      <p className="text-white/70 text-xs">Cliente escaneia e confirma a compra</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#10B981]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                      </div>
                      <p className="text-white/70 text-xs">Moedas creditadas automaticamente</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">Seu saldo</span>
                    <span className="text-[#F59E0B] font-bold">{wallet.balance} moedas</span>
                  </div>
                  <p className="text-white/40 text-xs mt-1">= R$ {(wallet.balance / RULES.COINS_PER_REAL).toFixed(2)}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate("/comerciante")}
                    className="py-2.5 rounded-lg bg-[#F59E0B] text-[#1C1917] text-xs font-semibold hover:bg-[#D97706] transition-colors active:scale-[0.97]"
                  >
                    Sou comerciante
                  </button>
                  <button
                    onClick={() => navigate("/carteira")}
                    className="py-2.5 rounded-lg bg-white/10 text-white text-xs font-semibold hover:bg-white/20 transition-colors active:scale-[0.97]"
                  >
                    Minha carteira
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - QR Code flows */}
      <section className="bg-muted/50 py-14">
        <div className="container">
          <h2 className="font-[var(--font-display)] text-xl md:text-2xl font-bold text-foreground text-center">
            Como funciona o QR Code?
          </h2>
          <p className="text-center text-muted-foreground text-sm mt-2 max-w-lg mx-auto">
            Sem maquininha, sem nota fiscal, sem complicação. Funciona com qualquer forma de pagamento.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Flow B - Accumulation */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-[#F59E0B]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="font-[var(--font-display)] font-bold text-base text-foreground">
                Ganhar Moedas
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Fluxo B — Confirmação bilateral</p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#F59E0B]">1</span>
                  <span>Comerciante digita o valor da venda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#F59E0B]">2</span>
                  <span>Sistema gera QR Code (válido {RULES.QR_EXPIRY_MINUTES} min)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#F59E0B]">3</span>
                  <span>Cliente escaneia e confirma</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#10B981]">✓</span>
                  <span>Moedas creditadas na carteira</span>
                </li>
              </ol>
            </div>

            {/* Flow A - Redemption */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-[#10B981]/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-4">
                <Coins className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="font-[var(--font-display)] font-bold text-base text-foreground">
                Usar Moedas
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Fluxo A — Resgate como desconto</p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#10B981]">1</span>
                  <span>Cliente informa que quer usar moedas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#10B981]">2</span>
                  <span>Cliente gera QR de resgate no app</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#10B981]">3</span>
                  <span>Comerciante escaneia e confirma</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#10B981]">✓</span>
                  <span>Desconto aplicado (até 50% da compra)</span>
                </li>
              </ol>
            </div>

            {/* Flow C - Pix Integrated */}
            <div className="p-6 rounded-2xl bg-card border border-border hover:border-[#8B5CF6]/30 transition-colors relative">
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] font-semibold">
                Em breve
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <h3 className="font-[var(--font-display)] font-bold text-base text-foreground">
                Pix Integrado
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Fluxo C — 100% automático</p>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#8B5CF6]">1</span>
                  <span>Comerciante gera cobrança Pix</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#8B5CF6]">2</span>
                  <span>Cliente paga pelo app do banco</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#8B5CF6]">3</span>
                  <span>Sistema confirma automaticamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#8B5CF6]">✓</span>
                  <span>Cashback processado sem intervenção</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <h2 className="font-[var(--font-display)] text-xl md:text-2xl font-bold text-foreground">
          Ganhe moedas comprando em
        </h2>
        <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/negocios?categoria=${cat.id}`)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-[#F59E0B]/40 hover:bg-[#F59E0B]/5 transition-all active:scale-[0.97] group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="text-xs font-medium text-foreground">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured businesses */}
      <section className="container py-12">
        <div className="flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-xl md:text-2xl font-bold text-foreground">
            Comércios com mais cashback
          </h2>
          <button
            onClick={() => navigate("/negocios")}
            className="flex items-center gap-1 text-sm font-medium text-[#F59E0B] hover:underline"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredBusinesses.map((biz, i) => (
            <BusinessCard key={biz.id} business={biz} index={i} />
          ))}
        </div>
      </section>

      {/* Security & Anti-fraud */}
      <section className="container py-12">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-[#10B981]/5 to-[#F59E0B]/5 border border-[#10B981]/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#10B981]" />
              </div>
              <div>
                <h3 className="font-[var(--font-display)] font-bold text-sm text-foreground">QR Dinâmico</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Cada QR Code expira em {RULES.QR_EXPIRY_MINUTES} minutos e só pode ser usado uma vez.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <h3 className="font-[var(--font-display)] font-bold text-sm text-foreground">Confirmação Bilateral</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Comerciante E cliente confirmam. Ninguém gera moedas sozinho.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <div>
                <h3 className="font-[var(--font-display)] font-bold text-sm text-foreground">Limites Automáticos</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Máx. {RULES.MAX_COINS_PER_DAY_CLIENT} moedas/dia, cooldown de {RULES.COOLDOWN_MINUTES} min, {RULES.MAX_TRANSACTIONS_PER_DAY} transações/dia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for merchants */}
      <section className="bg-[#1C1917] text-white py-14">
        <div className="container text-center">
          <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold">
            Comerciante: zero custo, zero complicação
          </h2>
          <p className="mt-3 text-white/70 max-w-lg mx-auto">
            Não precisa de maquininha, nota fiscal ou sistema. Só um celular com internet. Gere o QR, o cliente confirma e pronto.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/cadastro")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F59E0B] text-[#1C1917] font-semibold hover:bg-[#D97706] transition-colors active:scale-[0.97]"
            >
              <Store className="w-5 h-5" />
              Cadastrar meu comércio
            </button>
            <button
              onClick={() => navigate("/comerciante")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors active:scale-[0.97]"
            >
              <QrCode className="w-5 h-5" />
              Painel do comerciante
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
