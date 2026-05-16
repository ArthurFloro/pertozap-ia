import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import { Search, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import LocationFilter from "@/components/LocationFilter";
import { businesses, categories, getDistance, formatDistance } from "@/data/businesses";
import { useGeolocation } from "@/hooks/useGeolocation";

export default function Negocios() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialCategory = params.get("categoria") || "todos";
  const initialQuery = params.get("q") || "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [radius, setRadius] = useState(3);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("todos");

  const { lat, lng, error, loading, permissionDenied, requestLocation } = useGeolocation();

  const filtered = useMemo(() => {
    let result = businesses.map((b) => {
      const dist = lat && lng ? getDistance(lat, lng, b.lat, b.lng) : null;
      return { ...b, distanceKm: dist };
    });

    // Filter by radius if we have location
    if (lat && lng) {
      result = result.filter((b) => b.distanceKm !== null && b.distanceKm <= radius);
    }

    // Filter by neighborhood
    if (selectedNeighborhood !== "todos") {
      result = result.filter((b) => b.neighborhood === selectedNeighborhood);
    }

    // Filter by category
    if (activeCategory !== "todos") {
      result = result.filter((b) => b.category === activeCategory);
    }

    // Filter by search query
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

    // Sort by distance
    result.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));

    return result;
  }, [activeCategory, query, radius, selectedNeighborhood, lat, lng]);

  // Auto-expand radius if too few results
  const expandedMessage = useMemo(() => {
    if (filtered.length < 3 && radius < 10 && lat && lng) {
      const allInExpanded = businesses.filter((b) => {
        const dist = getDistance(lat, lng, b.lat, b.lng);
        return dist <= 10;
      });
      if (allInExpanded.length > filtered.length) {
        return `Poucos resultados no raio de ${radius} km. Tente expandir para ver mais comércios.`;
      }
    }
    return null;
  }, [filtered.length, radius, lat, lng]);

  const locationLabel = loading
    ? "Localizando..."
    : permissionDenied
    ? "Vila Esperança (padrão)"
    : error
    ? "Vila Esperança (padrão)"
    : "Sua localização atual";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-6">
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

        {/* Location filter */}
        <div className="mt-4">
          <LocationFilter
            radius={radius}
            setRadius={setRadius}
            selectedNeighborhood={selectedNeighborhood}
            setSelectedNeighborhood={setSelectedNeighborhood}
            hasLocation={!!(lat && lng && !permissionDenied)}
            onRequestLocation={requestLocation}
            locationLabel={locationLabel}
          />
        </div>

        {/* Category filters */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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

        {/* Expand suggestion */}
        {expandedMessage && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-primary">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{expandedMessage}</span>
            <button
              onClick={() => setRadius(10)}
              className="ml-auto px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
            >
              Expandir para 10 km
            </button>
          </div>
        )}

        {/* Results */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} {filtered.length === 1 ? "comércio encontrado" : "comércios encontrados"}
            {lat && lng && ` em até ${radius} km`}
          </p>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((biz, i) => (
                <BusinessCard
                  key={biz.id}
                  business={biz}
                  distance={biz.distanceKm !== null ? formatDistance(biz.distanceKm) : undefined}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🏪</p>
              <p className="text-lg font-[var(--font-display)] font-semibold text-foreground">
                Nenhum comércio encontrado
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Tente expandir o raio ou mudar o bairro para ver mais opções.
              </p>
              <button
                onClick={() => { setRadius(10); setSelectedNeighborhood("todos"); }}
                className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
              >
                Ver todos os comércios
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
