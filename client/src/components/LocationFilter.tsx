import { MapPin, Navigation, ChevronDown } from "lucide-react";
import { neighborhoods } from "@/data/businesses";

interface LocationFilterProps {
  radius: number;
  setRadius: (r: number) => void;
  selectedNeighborhood: string;
  setSelectedNeighborhood: (n: string) => void;
  hasLocation: boolean;
  onRequestLocation: () => void;
  locationLabel: string;
}

const radiusOptions = [1, 2, 3, 5, 10];

export default function LocationFilter({
  radius,
  setRadius,
  selectedNeighborhood,
  setSelectedNeighborhood,
  hasLocation,
  onRequestLocation,
  locationLabel,
}: LocationFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-card border border-border">
      {/* Location status */}
      <div className="flex items-center gap-2 flex-1">
        <button
          onClick={onRequestLocation}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/15 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          {hasLocation ? "Atualizar" : "Usar minha localização"}
        </button>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {locationLabel}
        </span>
      </div>

      {/* Radius selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground whitespace-nowrap">Raio:</span>
        <div className="flex gap-1">
          {radiusOptions.map((r) => (
            <button
              key={r}
              onClick={() => setRadius(r)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                radius === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {r} km
            </button>
          ))}
        </div>
      </div>

      {/* Neighborhood selector */}
      <div className="relative">
        <select
          value={selectedNeighborhood}
          onChange={(e) => setSelectedNeighborhood(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="todos">Todos os bairros</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
      </div>
    </div>
  );
}
