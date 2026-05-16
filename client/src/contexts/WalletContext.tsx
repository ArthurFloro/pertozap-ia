import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  type UserWallet,
  type Transaction,
  type QRCodeData,
  type MerchantWallet,
  levels,
  RULES,
  calculateCoins,
  generateQRId,
  mockTransactions,
} from "@/data/businesses";

interface WalletContextType {
  // Client wallet
  wallet: UserWallet;
  transactions: Transaction[];
  earnCoins: (merchantId: string, merchantName: string, amount: number, rate: number) => Transaction | null;
  spendCoins: (merchantId: string, merchantName: string, coins: number, purchaseAmount: number) => Transaction | null;

  // Merchant wallet
  merchantWallet: MerchantWallet;

  // QR Code management
  activeQR: QRCodeData | null;
  generateAccumulationQR: (merchantId: string, merchantName: string, amount: number, rate: number) => QRCodeData;
  generateRedemptionQR: (merchantId: string, merchantName: string, coins: number) => QRCodeData;
  confirmQR: (qrId: string, role: "client" | "merchant") => boolean;
  clearQR: () => void;

  // Pending transaction (bilateral confirmation)
  pendingTransaction: Transaction | null;
  confirmTransaction: (role: "client" | "merchant") => boolean;
  cancelTransaction: () => void;

  // Helpers
  getLevel: () => typeof levels[keyof typeof levels];
  canTransact: (merchantId: string) => { allowed: boolean; reason?: string };
  getDailyCoinsEarned: () => number;
  getDailyCoinsRedeemed: () => number;
}

const defaultWallet: UserWallet = {
  balance: 1247,
  totalEarned: 2850,
  totalRedeemed: 1603,
  level: "fiel",
  badges: ["padeiro", "explorador", "economista"],
  weeklyPurchases: 4,
  distinctStores: 3,
  lastActivity: "2025-05-16T08:31:00Z",
};

const defaultMerchantWallet: MerchantWallet = {
  totalCoinsDistributed: 8450,
  totalCoinsRedeemed: 3200,
  pendingRepayment: 32.0,
  totalSales: 156,
  transactionsToday: 3,
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<UserWallet>(defaultWallet);
  const [merchantWallet, setMerchantWallet] = useState<MerchantWallet>(defaultMerchantWallet);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [activeQR, setActiveQR] = useState<QRCodeData | null>(null);
  const [pendingTransaction, setPendingTransaction] = useState<Transaction | null>(null);

  const getLevel = useCallback(() => {
    return levels[wallet.level];
  }, [wallet.level]);

  const getDailyCoinsEarned = useCallback(() => {
    const today = new Date().toDateString();
    return transactions
      .filter(t => t.type === "acumulo" && t.status === "confirmada" && new Date(t.createdAt).toDateString() === today)
      .reduce((sum, t) => sum + t.coins, 0);
  }, [transactions]);

  const getDailyCoinsRedeemed = useCallback(() => {
    const today = new Date().toDateString();
    return transactions
      .filter(t => t.type === "resgate" && t.status === "confirmada" && new Date(t.createdAt).toDateString() === today)
      .reduce((sum, t) => sum + t.coins, 0);
  }, [transactions]);

  const canTransact = useCallback((merchantId: string): { allowed: boolean; reason?: string } => {
    const today = new Date().toDateString();
    const todayTransactions = transactions.filter(
      t => t.status === "confirmada" && new Date(t.createdAt).toDateString() === today
    );

    // Max transactions per day
    if (todayTransactions.length >= RULES.MAX_TRANSACTIONS_PER_DAY) {
      return { allowed: false, reason: `Limite de ${RULES.MAX_TRANSACTIONS_PER_DAY} transações diárias atingido.` };
    }

    // Cooldown check
    const lastWithMerchant = transactions
      .filter(t => t.merchantId === merchantId && t.status === "confirmada")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    if (lastWithMerchant) {
      const diff = Date.now() - new Date(lastWithMerchant.createdAt).getTime();
      const remaining = Math.ceil((RULES.COOLDOWN_MINUTES * 60 * 1000 - diff) / 60000);
      if (diff < RULES.COOLDOWN_MINUTES * 60 * 1000) {
        return { allowed: false, reason: `Aguarde ${remaining} min para nova transação neste comércio.` };
      }
    }

    return { allowed: true };
  }, [transactions]);

  // Generate QR Code for accumulation (merchant generates, client scans)
  const generateAccumulationQR = useCallback((merchantId: string, merchantName: string, amount: number, rate: number): QRCodeData => {
    const coinsToEarn = calculateCoins(amount, rate, wallet.level);
    const qr: QRCodeData = {
      id: generateQRId(),
      type: "acumulo",
      merchantId,
      merchantName,
      amount,
      coinsToEarn,
      expiresAt: new Date(Date.now() + RULES.QR_EXPIRY_MINUTES * 60 * 1000).toISOString(),
      status: "ativo",
      createdAt: new Date().toISOString(),
    };
    setActiveQR(qr);

    // Create pending transaction
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: "acumulo",
      clientId: "client-1",
      merchantId,
      merchantName,
      amount,
      coins: coinsToEarn,
      status: "pendente",
      confirmedByClient: false,
      confirmedByMerchant: true, // merchant generated it
      createdAt: new Date().toISOString(),
      qrCodeId: qr.id,
      paymentMethod: "dinheiro",
    };
    setPendingTransaction(tx);
    return qr;
  }, [wallet.level]);

  // Generate QR Code for redemption (client generates, merchant scans)
  const generateRedemptionQR = useCallback((merchantId: string, merchantName: string, coins: number): QRCodeData => {
    const qr: QRCodeData = {
      id: generateQRId(),
      type: "resgate",
      merchantId,
      merchantName,
      coinsToRedeem: coins,
      amount: coins / RULES.COINS_PER_REAL,
      expiresAt: new Date(Date.now() + RULES.QR_EXPIRY_MINUTES * 60 * 1000).toISOString(),
      status: "ativo",
      createdAt: new Date().toISOString(),
    };
    setActiveQR(qr);

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: "resgate",
      clientId: "client-1",
      merchantId,
      merchantName,
      amount: coins / RULES.COINS_PER_REAL,
      coins,
      status: "pendente",
      confirmedByClient: true, // client generated it
      confirmedByMerchant: false,
      createdAt: new Date().toISOString(),
      qrCodeId: qr.id,
      paymentMethod: "moedas",
    };
    setPendingTransaction(tx);
    return qr;
  }, []);

  const confirmQR = useCallback((qrId: string, role: "client" | "merchant"): boolean => {
    if (!activeQR || activeQR.id !== qrId) return false;
    if (new Date(activeQR.expiresAt) < new Date()) {
      setActiveQR(prev => prev ? { ...prev, status: "expirado" } : null);
      return false;
    }
    // Mark as confirmed by the role
    if (pendingTransaction) {
      setPendingTransaction(prev => {
        if (!prev) return null;
        return {
          ...prev,
          confirmedByClient: role === "client" ? true : prev.confirmedByClient,
          confirmedByMerchant: role === "merchant" ? true : prev.confirmedByMerchant,
        };
      });
    }
    return true;
  }, [activeQR, pendingTransaction]);

  const confirmTransaction = useCallback((role: "client" | "merchant"): boolean => {
    if (!pendingTransaction) return false;

    const updated = {
      ...pendingTransaction,
      confirmedByClient: role === "client" ? true : pendingTransaction.confirmedByClient,
      confirmedByMerchant: role === "merchant" ? true : pendingTransaction.confirmedByMerchant,
    };

    // Check if both confirmed
    if (updated.confirmedByClient && updated.confirmedByMerchant) {
      updated.status = "confirmada";
      updated.confirmedAt = new Date().toISOString();

      // Process the transaction
      if (updated.type === "acumulo") {
        setWallet(prev => {
          const newTotal = prev.totalEarned + updated.coins;
          let newLevel = prev.level;
          if (newTotal >= 5000) newLevel = "embaixador";
          else if (newTotal >= 2000) newLevel = "fiel";
          else if (newTotal >= 500) newLevel = "frequente";
          else newLevel = "novo";

          return {
            ...prev,
            balance: prev.balance + updated.coins,
            totalEarned: newTotal,
            level: newLevel,
            weeklyPurchases: prev.weeklyPurchases + 1,
            lastActivity: new Date().toISOString(),
          };
        });
        setMerchantWallet(prev => ({
          ...prev,
          totalCoinsDistributed: prev.totalCoinsDistributed + updated.coins,
          totalSales: prev.totalSales + 1,
          transactionsToday: prev.transactionsToday + 1,
        }));
      } else if (updated.type === "resgate") {
        setWallet(prev => ({
          ...prev,
          balance: prev.balance - updated.coins,
          totalRedeemed: prev.totalRedeemed + updated.coins,
          lastActivity: new Date().toISOString(),
        }));
        setMerchantWallet(prev => ({
          ...prev,
          totalCoinsRedeemed: prev.totalCoinsRedeemed + updated.coins,
          pendingRepayment: prev.pendingRepayment + updated.coins / RULES.COINS_PER_REAL,
        }));
      }

      setTransactions(prev => [updated, ...prev]);
      setPendingTransaction(null);
      setActiveQR(prev => prev ? { ...prev, status: "usado" } : null);
      return true;
    }

    setPendingTransaction(updated);
    return false;
  }, [pendingTransaction]);

  const cancelTransaction = useCallback(() => {
    if (pendingTransaction) {
      const cancelled = { ...pendingTransaction, status: "cancelada" as const };
      setTransactions(prev => [cancelled, ...prev]);
    }
    setPendingTransaction(null);
    setActiveQR(null);
  }, [pendingTransaction]);

  const clearQR = useCallback(() => {
    setActiveQR(null);
  }, []);

  const earnCoins = useCallback((merchantId: string, merchantName: string, amount: number, rate: number): Transaction | null => {
    const check = canTransact(merchantId);
    if (!check.allowed) return null;

    const coins = calculateCoins(amount, rate, wallet.level);
    const dailyEarned = getDailyCoinsEarned();
    if (dailyEarned + coins > RULES.MAX_COINS_PER_DAY_CLIENT) return null;

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: "acumulo",
      clientId: "client-1",
      merchantId,
      merchantName,
      amount,
      coins,
      status: "confirmada",
      confirmedByClient: true,
      confirmedByMerchant: true,
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      paymentMethod: "dinheiro",
    };

    setWallet(prev => {
      const newTotal = prev.totalEarned + coins;
      let newLevel = prev.level;
      if (newTotal >= 5000) newLevel = "embaixador";
      else if (newTotal >= 2000) newLevel = "fiel";
      else if (newTotal >= 500) newLevel = "frequente";
      else newLevel = "novo";

      return {
        ...prev,
        balance: prev.balance + coins,
        totalEarned: newTotal,
        level: newLevel,
        weeklyPurchases: prev.weeklyPurchases + 1,
        lastActivity: new Date().toISOString(),
      };
    });

    setTransactions(prev => [tx, ...prev]);
    return tx;
  }, [wallet.level, canTransact, getDailyCoinsEarned]);

  const spendCoins = useCallback((merchantId: string, merchantName: string, coins: number, purchaseAmount: number): Transaction | null => {
    if (wallet.balance < coins) return null;
    const maxRedeem = Math.floor(purchaseAmount * RULES.COINS_PER_REAL * RULES.MAX_REDEEM_PERCENT / 100);
    if (coins > maxRedeem) return null;

    const dailyRedeemed = getDailyCoinsRedeemed();
    if (dailyRedeemed + coins > RULES.MAX_REDEEM_PER_DAY) return null;

    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: "resgate",
      clientId: "client-1",
      merchantId,
      merchantName,
      amount: purchaseAmount,
      coins,
      status: "confirmada",
      confirmedByClient: true,
      confirmedByMerchant: true,
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      paymentMethod: "moedas",
    };

    setWallet(prev => ({
      ...prev,
      balance: prev.balance - coins,
      totalRedeemed: prev.totalRedeemed + coins,
      lastActivity: new Date().toISOString(),
    }));

    setTransactions(prev => [tx, ...prev]);
    return tx;
  }, [wallet.balance, getDailyCoinsRedeemed]);

  return (
    <WalletContext.Provider value={{
      wallet,
      transactions,
      earnCoins,
      spendCoins,
      merchantWallet,
      activeQR,
      generateAccumulationQR,
      generateRedemptionQR,
      confirmQR,
      clearQR,
      pendingTransaction,
      confirmTransaction,
      cancelTransaction,
      getLevel,
      canTransact,
      getDailyCoinsEarned,
      getDailyCoinsRedeemed,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
