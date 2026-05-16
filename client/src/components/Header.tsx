import { Link, useLocation } from "wouter";
import { Zap, Store, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105 group-active:scale-95">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-[var(--font-display)] font-bold text-lg text-foreground">
            Perto<span className="text-primary">Zap</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/negocios"
            className={`text-sm font-medium transition-colors hover:text-primary ${location === "/negocios" ? "text-primary" : "text-muted-foreground"}`}
          >
            Ver comércios
          </Link>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.97]"
          >
            <Store className="w-4 h-4" />
            Cadastrar meu comércio
          </Link>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border bg-white px-4 pb-4 pt-2 space-y-2">
          <Link
            href="/negocios"
            className="block py-2 text-sm font-medium text-foreground hover:text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Ver comércios
          </Link>
          <Link
            href="/cadastro"
            className="block py-2 text-sm font-medium text-primary"
            onClick={() => setMenuOpen(false)}
          >
            Cadastrar meu comércio
          </Link>
        </nav>
      )}
    </header>
  );
}
