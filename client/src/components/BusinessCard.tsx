import { Link } from "wouter";
import { MapPin, Clock, Coins, MessageCircle } from "lucide-react";
import type { Business } from "@/data/businesses";
import { categories } from "@/data/businesses";

interface BusinessCardProps {
  business: Business;
  distance?: string;
  index: number;
}

export default function BusinessCard({ business, distance, index }: BusinessCardProps) {
  const category = categories.find((c) => c.id === business.category);
  const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent("Olá! Vi sua oferta no Moeda do Bairro e quero saber mais.")}`;

  return (
    <div
      className="group bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium text-foreground">
          {category?.icon} {category?.label}
        </span>
        {/* Cashback badge */}
        <span className="absolute top-3 right-3 px-2 py-1 bg-[#F59E0B]/95 backdrop-blur-sm rounded-md text-xs font-bold text-[#1C1917] flex items-center gap-1">
          <Coins className="w-3 h-3" />
          {business.cashbackRate} moedas/R$1
        </span>
        {/* Offer */}
        <span className="absolute bottom-3 left-3 right-3 px-2 py-1.5 bg-[#1C1917]/80 backdrop-blur-sm rounded-md text-xs font-medium text-white truncate">
          {business.offer}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-[var(--font-display)] font-semibold text-base text-foreground leading-tight">
            {business.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {business.description}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {distance || business.neighborhood}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {business.hours}
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <Link
            href={`/negocios/${business.id}`}
            className="flex-1 text-center py-2.5 px-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors active:scale-[0.97]"
          >
            Ver detalhes
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20BD5A] transition-colors active:scale-[0.97]"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
