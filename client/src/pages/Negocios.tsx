import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import { businesses, categories } from "@/data/businesses";

export default function Negocios() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialCategory = params.get("categoria") || "todos";
  const initialQuery = params.get("q") || "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    let result = businesses;
    if (activeCategory !== "todos") {
      result = result.filter((b) => b.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q)) ||
          b.offer.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-8">
        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome, produto ou serviço..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* Category filters */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("todos")}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "todos"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-8">
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} {filtered.length === 1 ? "comércio encontrado" : "comércios encontrados"}
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((biz, i) => (
                <BusinessCard key={biz.id} business={biz} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🏪</p>
              <p className="text-lg font-[var(--font-display)] font-semibold text-foreground">
                Nenhum comércio encontrado
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Ainda não temos comércios nessa categoria. Que tal cadastrar o primeiro?
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
