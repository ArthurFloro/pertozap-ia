import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ArrowRight, Coins, Store, MessageCircle, Trophy, Shield, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { businesses, categories, levels } from "@/data/businesses";
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
  const currentLevel = levels[wallet.level];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C1917] via-[#292524] to-[#44403C]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#F59E0B] blur-3xl" />
          <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full bg-[#F59E0B] blur-3xl" />
        </div>

        <div className="container relative py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-xs font-semibold mb-6">
                <Coins className="w-3.5 h-3.5" />
                100 moedas = R$ 1,00
              </div>
              <h1 className="font-[var(--font-display)] text-3xl md:text-5xl font-bold text-white leading-tight">
                Cashback que fica na vizinhança
              </h1>
              <p className="mt-4 text-lg text-white/75 max-w-lg">
                Compre na padaria, na farmácia ou no mercadinho — ganhe moedas e use em qualquer comércio do bairro. O dinheiro circula aqui.
              </p>

              {/* Search */}
              <form onSubmit={handleSearch} className="mt-8 flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="O que você procura hoje?"
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
            </div>

            {/* Wallet preview card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 max-w-sm ml-auto">
                <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Sua carteira</p>
                <p className="text-4xl font-[var(--font-display)] font-bold text-[#F59E0B] mt-2">
                  {wallet.balance} <span className="text-lg text-white/50">moedas</span>
                </p>
                <p className="text-sm text-white/50 mt-1">
                  = R$ {(wallet.balance / 100).toFixed(2)} em cashback
                </p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">Nível</span>
                    <span className="text-xs font-semibold" style={{ color: currentLevel.color }}>
                      {currentLevel.label}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min((wallet.totalEarned / currentLevel.max) * 100, 100)}%`,
                        backgroundColor: currentLevel.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    {wallet.totalEarned} / {currentLevel.max === Infinity ? "∞" : currentLevel.max} moedas para próximo nível
                  </p>
                </div>
                <button
                  onClick={() => navigate("/carteira")}
                  className="mt-4 w-full py-2.5 rounded-lg bg-[#F59E0B] text-[#1C1917] text-sm font-semibold hover:bg-[#D97706] transition-colors active:scale-[0.97]"
                >
                  Ver minha carteira
                </button>
              </div>
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
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all active:scale-[0.97] group"
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

      {/* How it works */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <h2 className="font-[var(--font-display)] text-xl md:text-2xl font-bold text-foreground text-center">
            Como funciona a Moeda do Bairro?
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="flex flex-col items-center text-center p-5 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Store className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-[var(--font-display)] font-semibold text-sm text-foreground">1. Compre local</h3>
              <p className="text-xs text-muted-foreground mt-2">
                Compre em qualquer comércio participante do bairro.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-5 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-[#F59E0B]/10 flex items-center justify-center mb-3">
                <Coins className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="font-[var(--font-display)] font-semibold text-sm text-foreground">2. Ganhe moedas</h3>
              <p className="text-xs text-muted-foreground mt-2">
                Receba 10 a 20 moedas por cada R$ 1 gasto (depende do seu nível).
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-5 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-3">
                <Trophy className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="font-[var(--font-display)] font-semibold text-sm text-foreground">3. Suba de nível</h3>
              <p className="text-xs text-muted-foreground mt-2">
                Complete desafios e ganhe badges. Quanto mais compra, mais ganha.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-5 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <h3 className="font-[var(--font-display)] font-semibold text-sm text-foreground">4. Use como desconto</h3>
              <p className="text-xs text-muted-foreground mt-2">
                Resgate moedas em qualquer comércio. 100 moedas = R$ 1,00.
              </p>
            </div>
          </div>
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
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
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

      {/* Security section */}
      <section className="container py-12">
        <div className="p-8 rounded-2xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h3 className="font-[var(--font-display)] font-bold text-lg text-foreground">
                Seguro e transparente
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cada transação é validada com código de 4 dígitos entre comerciante e cliente. Limites diários protegem contra fraudes. Suas moedas valem dinheiro real e ficam sempre no bairro.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA for merchants */}
      <section className="bg-accent text-accent-foreground py-14">
        <div className="container text-center">
          <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold">
            Comerciante: fidelize seus clientes sem custo
          </h2>
          <p className="mt-3 text-accent-foreground/80 max-w-lg mx-auto">
            Cadastre seu comércio e ofereça cashback em moedas. Seus clientes voltam mais, gastam mais e indicam vizinhos.
          </p>
          <button
            onClick={() => navigate("/cadastro")}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1C1917] text-white font-semibold hover:bg-[#292524] transition-colors active:scale-[0.97]"
          >
            <Store className="w-5 h-5" />
            Cadastrar meu comércio grátis
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
