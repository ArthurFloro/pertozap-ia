import { Zap, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#166534] text-white mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-[var(--font-display)] font-bold text-lg">
              PertoZap
            </span>
          </div>

          {/* Impact message */}
          <p className="text-sm text-white/80 text-center">
            Quando o bairro compra perto, o dinheiro circula na comunidade.
          </p>

          {/* Made with love */}
          <p className="text-sm text-white/60 text-right flex items-center justify-end gap-1">
            Feito com <Heart className="w-3 h-3 text-red-400 fill-red-400" /> para o comércio local
          </p>
        </div>

        {/* Impact metrics */}
        <div className="mt-8 pt-8 border-t border-white/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-[var(--font-display)] font-bold">12</p>
            <p className="text-xs text-white/60 mt-1">Comércios cadastrados</p>
          </div>
          <div>
            <p className="text-2xl font-[var(--font-display)] font-bold">5</p>
            <p className="text-xs text-white/60 mt-1">Categorias locais</p>
          </div>
          <div>
            <p className="text-2xl font-[var(--font-display)] font-bold">48</p>
            <p className="text-xs text-white/60 mt-1">Cliques no WhatsApp</p>
          </div>
          <div>
            <p className="text-2xl font-[var(--font-display)] font-bold">R$ 1.200</p>
            <p className="text-xs text-white/60 mt-1">Vendas estimadas</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
