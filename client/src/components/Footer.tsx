import { Coins, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1C1917] text-white mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Coins className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <span className="font-[var(--font-display)] font-bold text-lg">
              Moeda do Bairro
            </span>
          </div>

          <p className="text-sm text-white/70 text-center">
            Cashback que fica na vizinhança. 100 moedas = R$ 1,00.
          </p>

          <p className="text-sm text-white/50 text-right flex items-center justify-end gap-1">
            Feito com <Heart className="w-3 h-3 text-red-400 fill-red-400" /> para o comércio local
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-[var(--font-display)] font-bold text-[#F59E0B]">12.450</p>
            <p className="text-xs text-white/50 mt-1">Moedas em circulação</p>
          </div>
          <div>
            <p className="text-2xl font-[var(--font-display)] font-bold text-[#F59E0B]">10</p>
            <p className="text-xs text-white/50 mt-1">Comércios participantes</p>
          </div>
          <div>
            <p className="text-2xl font-[var(--font-display)] font-bold text-[#F59E0B]">87</p>
            <p className="text-xs text-white/50 mt-1">Vizinhos ativos</p>
          </div>
          <div>
            <p className="text-2xl font-[var(--font-display)] font-bold text-[#F59E0B]">R$ 3.200</p>
            <p className="text-xs text-white/50 mt-1">Circulando no bairro</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
