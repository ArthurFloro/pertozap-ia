import { useState } from "react";
import { useLocation } from "wouter";
import { Search, ArrowRight, Sparkles, Store, MessageCircle, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { businesses, categories } from "@/data/businesses";

export default function Home() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/negocios?q=${encodeURIComponent(searchQuery)}`);
  };

  const featuredBusinesses = businesses.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663643726990/BUbK5RQgwnbYbZG8mkYPah/hero-banner-53YCq99riyXoNkraiiamkQ.webp"
            alt="Comércio local"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#166534]/90 via-[#166534]/70 to-[#166534]/40" />
        </div>

        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="font-[var(--font-display)] text-3xl md:text-5xl font-bold text-white leading-tight">
              Descubra o comércio do seu bairro em segundos
            </h1>
            <p className="mt-4 text-lg text-white/85 max-w-lg">
              Encontre ofertas locais e fale direto com o comerciante pelo WhatsApp. Simples assim.
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
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-foreground text-base shadow-lg border-0 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-4 rounded-xl bg-[#EAB308] text-[#1C1917] font-semibold text-sm hover:bg-[#D4A007] transition-colors active:scale-[0.97] shadow-lg"
              >
                Buscar
              </button>
            </form>

            {/* Quick stats */}
            <div className="mt-6 flex gap-6 text-white/70 text-sm">
              <span>12 comércios</span>
              <span>5 categorias</span>
              <span>Vila Esperança</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <h2 className="font-[var(--font-display)] text-xl md:text-2xl font-bold text-foreground">
          O que você precisa?
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
            Como funciona?
          </h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-[var(--font-display)] font-semibold text-foreground">Busque</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Procure por categoria ou nome do que você precisa no bairro.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-[#EAB308]/10 flex items-center justify-center mb-4">
                <Store className="w-6 h-6 text-[#EAB308]" />
              </div>
              <h3 className="font-[var(--font-display)] font-semibold text-foreground">Encontre</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Veja ofertas, horários e informações dos comércios pertinho de você.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <h3 className="font-[var(--font-display)] font-semibold text-foreground">Fale direto</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Chame no WhatsApp e resolva sua compra em poucos segundos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured businesses */}
      <section className="container py-12">
        <div className="flex items-center justify-between">
          <h2 className="font-[var(--font-display)] text-xl md:text-2xl font-bold text-foreground">
            Destaques do bairro
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

      {/* CTA for merchants */}
      <section className="relative overflow-hidden py-16">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663643726990/BUbK5RQgwnbYbZG8mkYPah/merchant-register-FsXorLTm3Y42runGoX8RFg.webp"
            alt="Comerciante cadastrando"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917]/85 to-[#1C1917]/60" />
        </div>
        <div className="container relative">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-[#EAB308]" />
              <span className="text-sm font-medium text-[#EAB308]">Com IA integrada</span>
            </div>
            <h2 className="font-[var(--font-display)] text-2xl md:text-3xl font-bold text-white">
              Cadastre seu comércio grátis
            </h2>
            <p className="mt-3 text-white/80">
              Em menos de 2 minutos, sua vitrine estará pronta. Nossa IA sugere descrições e ofertas para você.
            </p>
            <button
              onClick={() => navigate("/cadastro")}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#EAB308] text-[#1C1917] font-semibold hover:bg-[#D4A007] transition-colors active:scale-[0.97]"
            >
              <Store className="w-5 h-5" />
              Cadastrar meu comércio grátis
            </button>
          </div>
        </div>
      </section>

      {/* WhatsApp connection section */}
      <section className="container py-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="font-[var(--font-display)] text-xl md:text-2xl font-bold text-foreground">
              Conexão direta pelo WhatsApp
            </h2>
            <p className="mt-3 text-muted-foreground">
              Sem intermediários, sem taxas, sem complicação. O cliente encontra sua oferta e fala direto com você pelo WhatsApp. A venda acontece na conversa.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                </div>
                <span className="text-sm text-foreground">Mensagem pré-preenchida para o cliente</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">Atendimento pessoal e humanizado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EAB308]/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#EAB308]" />
                </div>
                <span className="text-sm text-foreground">Zero taxas sobre suas vendas</span>
              </div>
            </div>
          </div>
          <div className="flex-1 max-w-sm">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663643726990/BUbK5RQgwnbYbZG8mkYPah/whatsapp-connection-LpVyssuCQCvNMhfo5NBdua.webp"
              alt="Conexão WhatsApp"
              className="w-full rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
