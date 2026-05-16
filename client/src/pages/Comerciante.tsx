// ============================================================
// MOEDA DO BAIRRO — Painel do Comerciante
// UX: 1 botão principal "Nova Venda", máximo 3 toques
// ============================================================
import { useState } from "react";
import { useLocation } from "wouter";
import { QrCode, ArrowLeft, Coins, Store, CheckCircle2, XCircle, Clock, AlertTriangle, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import { useWallet } from "@/contexts/WalletContext";
import { businesses, RULES, formatCoinsToReais } from "@/data/businesses";
import { toast } from "sonner";

type Step = "idle" | "amount" | "qr_generated" | "confirmed" | "redeem_scan" | "redeem_confirmed";

export default function Comerciante() {
  const [, navigate] = useLocation();
  const { merchantWallet, generateAccumulationQR, activeQR, confirmTransaction, pendingTransaction, cancelTransaction } = useWallet();
  const [step, setStep] = useState<Step>("idle");
  const [amount, setAmount] = useState("");
  const [selectedBusiness] = useState(businesses[0]); // Demo: first business

  const handleGenerateQR = () => {
    const value = parseFloat(amount);
    if (!value || value < 1) {
      toast.error("Valor mínimo é R$ 1,00");
      return;
    }
    if (value > 500) {
      toast.error("Valor máximo por transação é R$ 500,00");
      return;
    }
    generateAccumulationQR(selectedBusiness.id, selectedBusiness.name, value, selectedBusiness.cashbackRate);
    setStep("qr_generated");
    toast.success("QR Code gerado! Mostre para o cliente.");
  };

  const handleClientConfirm = () => {
    // Simulates client scanning and confirming
    const result = confirmTransaction("client");
    if (result) {
      setStep("confirmed");
      toast.success("Transação confirmada! Moedas creditadas.");
    } else {
      // If not fully confirmed yet, mark client side
      confirmTransaction("client");
      setStep("confirmed");
      toast.success("Transação confirmada com sucesso!");
    }
  };

  const handleCancel = () => {
    cancelTransaction();
    setStep("idle");
    setAmount("");
    toast.info("Transação cancelada.");
  };

  const handleNewSale = () => {
    setStep("amount");
    setAmount("");
  };

  const handleReset = () => {
    setStep("idle");
    setAmount("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />

      <main className="flex-1 container py-6">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-[var(--font-display)] text-xl font-bold text-foreground">Painel do Comerciante</h1>
            <p className="text-xs text-muted-foreground">{selectedBusiness.name}</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground">Vendas hoje</p>
            <p className="text-xl font-bold text-foreground mt-1">{merchantWallet.transactionsToday}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground">Moedas distribuídas</p>
            <p className="text-xl font-bold text-[#F59E0B] mt-1">{merchantWallet.totalCoinsDistributed}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground">Moedas resgatadas aqui</p>
            <p className="text-xl font-bold text-[#10B981] mt-1">{merchantWallet.totalCoinsRedeemed}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <p className="text-xs text-muted-foreground">A receber (repasse)</p>
            <p className="text-xl font-bold text-foreground mt-1">R$ {merchantWallet.pendingRepayment.toFixed(2)}</p>
          </div>
        </div>

        {/* Main action area */}
        <div className="max-w-md mx-auto">
          {step === "idle" && (
            <div className="text-center space-y-4">
              <div className="p-8 rounded-2xl bg-card border border-border">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center mb-4">
                  <QrCode className="w-10 h-10 text-[#F59E0B]" />
                </div>
                <h2 className="font-[var(--font-display)] text-lg font-bold text-foreground">
                  Registrar venda
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Gere um QR Code para o cliente escanear e ganhar moedas.
                </p>
                <button
                  onClick={handleNewSale}
                  className="mt-6 w-full py-4 rounded-xl bg-[#F59E0B] text-[#1C1917] font-bold text-base hover:bg-[#D97706] transition-colors active:scale-[0.97] shadow-md"
                >
                  Nova Venda
                </button>
              </div>

              {/* Redeem info */}
              <div className="p-5 rounded-xl bg-[#10B981]/5 border border-[#10B981]/20">
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-[#10B981]" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-foreground">Cliente quer usar moedas?</p>
                    <p className="text-xs text-muted-foreground">Peça para ele mostrar o QR de resgate no celular.</p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="p-4 rounded-xl bg-muted/50 border border-border text-left">
                <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                  Dicas para vender mais
                </p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  <li>• Lembre o cliente de escanear o QR após pagar</li>
                  <li>• Moedas fidelizam: clientes voltam para usar o cashback</li>
                  <li>• Cada R$ 1 gasto gera {selectedBusiness.cashbackRate} moedas para o cliente</li>
                </ul>
              </div>
            </div>
          )}

          {step === "amount" && (
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="font-[var(--font-display)] text-lg font-bold text-foreground text-center">
                Valor da venda
              </h2>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Digite o valor total que o cliente pagou
              </p>

              <div className="mt-6 relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 text-2xl font-bold text-center rounded-xl border border-border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
                  autoFocus
                />
              </div>

              {amount && parseFloat(amount) > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-[#F59E0B]/5 border border-[#F59E0B]/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cliente vai ganhar:</span>
                    <span className="font-bold text-[#F59E0B]">
                      ~{Math.floor(parseFloat(amount) * selectedBusiness.cashbackRate)} moedas
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    = {formatCoinsToReais(Math.floor(parseFloat(amount) * selectedBusiness.cashbackRate))} em cashback
                  </p>
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={handleReset}
                  className="py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGenerateQR}
                  className="py-3 rounded-xl bg-[#F59E0B] text-[#1C1917] font-bold hover:bg-[#D97706] transition-colors active:scale-[0.97]"
                >
                  Gerar QR
                </button>
              </div>
            </div>
          )}

          {step === "qr_generated" && activeQR && (
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F59E0B]/10 flex items-center justify-center mb-3">
                <Clock className="w-6 h-6 text-[#F59E0B] animate-pulse" />
              </div>
              <h2 className="font-[var(--font-display)] text-lg font-bold text-foreground">
                QR Code gerado!
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Mostre para o cliente escanear
              </p>

              {/* Simulated QR Code */}
              <div className="mt-6 p-6 rounded-2xl bg-white border-2 border-dashed border-[#F59E0B]/30 inline-block">
                <div className="w-48 h-48 bg-[#1C1917] rounded-xl flex items-center justify-center relative overflow-hidden">
                  {/* QR pattern simulation */}
                  <div className="absolute inset-3 grid grid-cols-8 grid-rows-8 gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-sm ${Math.random() > 0.4 ? "bg-white" : "bg-transparent"}`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-lg bg-[#F59E0B] flex items-center justify-center">
                      <Coins className="w-6 h-6 text-[#1C1917]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-bold">R$ {activeQR.amount?.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Moedas:</span>
                  <span className="font-bold text-[#F59E0B]">{activeQR.coinsToEarn}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Expira em:</span>
                  <span className="font-medium text-destructive">{RULES.QR_EXPIRY_MINUTES} min</span>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-[#F59E0B]/5 border border-[#F59E0B]/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                  <p className="text-xs text-muted-foreground">
                    Aguardando confirmação do cliente...
                  </p>
                </div>
              </div>

              {/* Simulate client confirmation */}
              <button
                onClick={handleClientConfirm}
                className="mt-4 w-full py-3 rounded-xl bg-[#10B981] text-white font-bold hover:bg-[#059669] transition-colors active:scale-[0.97]"
              >
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Simular: Cliente confirmou
                </span>
              </button>

              <button
                onClick={handleCancel}
                className="mt-2 w-full py-3 rounded-xl border border-destructive/30 text-destructive font-medium hover:bg-destructive/5 transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Cancelar
                </span>
              </button>
            </div>
          )}

          {step === "confirmed" && (
            <div className="p-6 rounded-2xl bg-card border border-[#10B981]/30 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#10B981]/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
              </div>
              <h2 className="font-[var(--font-display)] text-lg font-bold text-foreground">
                Venda confirmada!
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                O cliente recebeu as moedas na carteira.
              </p>

              {pendingTransaction && (
                <div className="mt-4 p-3 rounded-lg bg-[#10B981]/5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Valor:</span>
                    <span className="font-bold">R$ {pendingTransaction.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Moedas creditadas:</span>
                    <span className="font-bold text-[#F59E0B]">{pendingTransaction.coins}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => { setStep("idle"); setAmount(""); }}
                className="mt-6 w-full py-4 rounded-xl bg-[#F59E0B] text-[#1C1917] font-bold text-base hover:bg-[#D97706] transition-colors active:scale-[0.97]"
              >
                Nova Venda
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
