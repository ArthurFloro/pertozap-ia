import { Link, useLocation } from "wouter";
import { Coins, Store, Menu, X, Wallet, QrCode } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";

export default function Header() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { wallet } = useWallet();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
            <Coins className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-[var(--font-display)] font-bold text-lg text-foreground">
            Moeda<span className="text-primary"> do Bairro</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3">
          <Link
            href="/negocios"
            className={`text-sm font-medium transition-colors hover:text-primary ${location === "/negocios" ? "text-primary" : "text-muted-foreground"}`}
          >
            Comércios
          </Link>
          <Link
            href="/carteira"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/15 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            {wallet.balance} moedas
          </Link>
          <Link
            href="/comerciante"
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${location === "/comerciante" ? "bg-[#F59E0B]/15 text-[#D97706]" : "bg-muted text-foreground hover:bg-muted/80"}`}
          >
            <QrCode className="w-4 h-4" />
            Painel
          </Link>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
          >
            <Store className="w-4 h-4" />
            Cadastrar
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/carteira"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold"
          >
            <Coins className="w-3.5 h-3.5" />
            {wallet.balance}
          </Link>
          <button
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-white px-4 pb-4 pt-2 space-y-2">
          <Link
            href="/negocios"
            className="block py-2 text-sm font-medium text-foreground hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Comércios
          </Link>
          <Link
            href="/carteira"
            className="block py-2 text-sm font-medium text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Minha Carteira
          </Link>
          <Link
            href="/comerciante"
            className="block py-2 text-sm font-medium text-[#D97706]"
            onClick={() => setMenuOpen(false)}
          >
            Painel do Comerciante
          </Link>
          <Link
            href="/cadastro"
            className="block py-2 text-sm font-medium text-muted-foreground"
            onClick={() => setMenuOpen(false)}
          >
            Cadastrar comércio
          </Link>
        </nav>
      )}
    </header>
  );
}
