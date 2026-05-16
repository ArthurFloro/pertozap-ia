import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type UserWallet, levels, calculateCoins } from "@/data/businesses";

interface WalletContextType {
  wallet: UserWallet;
  earnCoins: (amount: number) => void;
  spendCoins: (coins: number) => boolean;
  getLevel: () => typeof levels[keyof typeof levels];
}

const defaultWallet: UserWallet = {
  balance: 347,
  totalEarned: 1250,
  level: "frequente",
  badges: ["padeiro", "explorador", "economista"],
  weeklyPurchases: 4,
  distinctStores: 2,
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<UserWallet>(defaultWallet);

  const getLevel = useCallback(() => {
    return levels[wallet.level];
  }, [wallet.level]);

  const earnCoins = useCallback((amount: number) => {
    setWallet((prev) => {
      const earned = calculateCoins(amount, prev.level);
      const newTotal = prev.totalEarned + earned;
      let newLevel = prev.level;

      if (newTotal >= 5000) newLevel = "embaixador";
      else if (newTotal >= 2000) newLevel = "fiel";
      else if (newTotal >= 500) newLevel = "frequente";
      else newLevel = "novo";

      return {
        ...prev,
        balance: prev.balance + earned,
        totalEarned: newTotal,
        level: newLevel,
        weeklyPurchases: prev.weeklyPurchases + 1,
      };
    });
  }, []);

  const spendCoins = useCallback((coins: number): boolean => {
    if (wallet.balance < coins) return false;
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance - coins,
    }));
    return true;
  }, [wallet.balance]);

  return (
    <WalletContext.Provider value={{ wallet, earnCoins, spendCoins, getLevel }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
