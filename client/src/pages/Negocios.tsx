// ============================================================
// MOEDA DO BAIRRO — Página de Comércios
// Filtros: GPS/raio, bairro, categoria, busca textual
// Lógica: bairros pequenos expandem automaticamente para garantir visibilidade
// ============================================================
import { useState, useMemo } from "react";
import { useSearch } from "wouter";
import { Search, AlertCircle, MapPin, Globe, Compass } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BusinessCard from "@/components/BusinessCard";
import LocationFilter from "@/components/LocationFilter";
import { businesses, categories, neighborhoods, getDistance, formatDistance } from "@/data/businesses";
import { useGeolocation } from "@/hooks/useGeolocation";

const MIN_RESULTS_THRESHOLD = 3; // Se menos de 3 resultados, sugere expandir
const AUTO_EXPAND_RADIUS = 10; // km para expansão automática

export default function Negocios() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialCategory = params.get("categoria") || "todos";
  const initialQuery = params.get("q") || "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [radius, setRadius] = useState(3);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState("todos");
  const [viewMode, setViewMode] = useState<"nearby" | "explore">("nearby");

  const { lat, lng, error, loading, permissionDenied, requestLocation } = useGeolocation();
  const hasRealLocation = !!(lat && lng && !permissionDenied && !error);

  const filtered = useMemo(() => {
    let result = businesses.map((b) => {
      const dist = lat && lng ? getDistance(lat, lng, b.lat, b.lng) : null;
      return { ...b, distanceKm: dist };
    });

    // In "nearby" mode, apply radius filter only if we have real location
    if (viewMode === "nearby" && hasRealLocation) {
      result = result.filter((b) => b.distanceKm !== null && b.distanceKm <= radius);
    }

    // In "explore" mode or without location, don't filter by distance
    // but still allow neighborhood filter

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
          b.offer.toLowerCase().includes(q) ||
          b.neighborhood.toLowerCase().includes(q)
      );
    }

    // Sort: by distance if available, otherwise alphabetically
    if (hasRealLocation) {
      result.sort((a, b) => (a.distanceKm ?? 99) - (b.distanceKm ?? 99));
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [activeCategory, query, radius, selectedNeighborhood, lat, lng, viewMode, hasRealLocation]);

  // Detect small neighborhoods and suggest expansion
  const neighborhoodInfo = useMemo(() => {
    if (selectedNeighborhood === "todos") return null;
    const inNeighborhood = businesses.filter((b) => b.neighborhood === selectedNeighborhood);
    if (inNeighborhood.length <= MIN_RESULTS_THRESHOLD) {
      // Count nearby businesses in expanded area
      const nearbyCount = hasRealLocation
        ? businesses.filter((b) => {
            const dist = getDistance(lat!, lng!, b.lat, b.lng);
            return dist <= AUTO_EXPAND_RADIUS;
          }).length
        : businesses.length;
      return {
        isSmall: true,
        count: inNeighborhood.length,
        nearbyTotal: nearbyCount,
        message: `"${selectedNeighborhood}" tem apenas ${inNeighborhood.length} comércios cadastrados. Veja também os vizinhos próximos!`,
      };
    }
    return { isSmall: false, count: inNeighborhood.length, nearbyTotal: 0, message: null };
  }, [selectedNeighborhood, hasRealLocation, lat, lng]);

  // Auto-expand radius suggestion
  const expandedMessage = useMemo(() => {
    if (viewMode === "explore") return null;
    if (filtered.length < MIN_RESULTS_THRESHOLD && radius < AUTO_EXPAND_RADIUS && hasRealLocation) {
      const allInExpanded = businesses.filter((b) => {
        const dist = getDistance(lat!, lng!, b.lat, b.lng);
        return dist <= AUTO_EXPAND_RADIUS;
      });
      if (allInExpanded.length > filtered.length) {
        return `Poucos resultados no raio de ${radius} km. Existem ${allInExpanded.length} comércios em até ${AUTO_EXPAND_RADIUS} km.`;
      }
    }
    return null;
  }, [filtered.length, radius, lat, lng, viewMode, hasRealLocation]);

  const locationLabel = loading
    ? "Localizando..."
    : hasRealLocation
    ? "Sua localização atual"
    : permissionDenied
    ? "Localização negada"
    : error
    ? "Localização indisponível"
    : "Localizando...";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="container py-6">
        {/* Search bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome, produto, serviço ou bairro..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* View mode toggle */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => { setViewMode("nearby"); if (!hasRealLocation) requestLocation(); }}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "nearby"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Compass className="w-4 h-4" />
            Perto de mim
          </button>
          <button
            onClick={() => setViewMode("explore")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === "explore"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <Globe className="w-4 h-4" />
            Explorar bairros
          </button>
        </div>

        {/* Location filter (only in nearby mode) */}
        {viewMode === "nearby" && (
          <div className="mt-4">
            <LocationFilter
              radius={radius}
              setRadius={setRadius}
              selectedNeighborhood={selectedNeighborhood}
              setSelectedNeighborhood={setSelectedNeighborhood}
              hasLocation={hasRealLocation}
              onRequestLocation={requestLocation}
              locationLabel={locationLabel}
            />
          </div>
        )}

        {/* Neighborhood selector (in explore mode) */}
        {viewMode === "explore" && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedNeighborhood("todos")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedNeighborhood === "todos"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              Todos os bairros
            </button>
            {neighborhoods.map((n) => {
              const count = businesses.filter((b) => b.neighborhood === n).length;
              return (
                <button
                  key={n}
                  onClick={() => setSelectedNeighborhood(n)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedNeighborhood === n
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {n} <span className="text-xs opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Small neighborhood alert */}
        {neighborhoodInfo?.isSmall && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-[#F59E0B]/5 border border-[#F59E0B]/20 text-sm text-foreground">
            <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />
            <span className="text-muted-foreground">{neighborhoodInfo.message}</span>
            <button
              onClick={() => setSelectedNeighborhood("todos")}
              className="ml-auto px-3 py-1 rounded-md bg-[#F59E0B] text-[#1C1917] text-xs font-semibold hover:bg-[#D97706] transition-colors whitespace-nowrap"
            >
              Ver todos
            </button>
          </div>
        )}

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
              onClick={() => setRadius(AUTO_EXPAND_RADIUS)}
              className="ml-auto px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 whitespace-nowrap"
            >
              Expandir para {AUTO_EXPAND_RADIUS} km
            </button>
          </div>
        )}

        {/* No location warning in nearby mode */}
        {viewMode === "nearby" && !hasRealLocation && !loading && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-muted border border-border text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>Sem acesso à localização. Mostrando todos os comércios. Ative o GPS para ver por distância.</span>
            <button
              onClick={requestLocation}
              className="ml-auto px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 whitespace-nowrap"
            >
              Ativar GPS
            </button>
          </div>
        )}

        {/* Results */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} {filtered.length === 1 ? "comércio encontrado" : "comércios encontrados"}
            {viewMode === "nearby" && hasRealLocation && ` em até ${radius} km`}
            {viewMode === "explore" && selectedNeighborhood !== "todos" && ` em ${selectedNeighborhood}`}
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
                {viewMode === "nearby"
                  ? "Tente expandir o raio ou mude para 'Explorar bairros'."
                  : "Tente outro bairro ou remova os filtros."}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                {viewMode === "nearby" && (
                  <button
                    onClick={() => { setRadius(AUTO_EXPAND_RADIUS); setSelectedNeighborhood("todos"); }}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90"
                  >
                    Expandir raio
                  </button>
                )}
                <button
                  onClick={() => { setViewMode("explore"); setSelectedNeighborhood("todos"); setActiveCategory("todos"); setQuery(""); }}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold hover:bg-muted/80"
                >
                  Ver todos
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
