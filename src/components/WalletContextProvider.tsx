"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { PublicKey } from "@solana/web3.js";

interface WalletContextState {
  walletAddress: string | null;
  publicKey: PublicKey | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const WalletContext = createContext<WalletContextState>({} as WalletContextState);

export const useWallet = () => useContext(WalletContext);

export const WalletContextProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const publicKey = useMemo(() => {
    return walletAddress ? new PublicKey(walletAddress) : null;
  }, [walletAddress]);

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        // Only connect if trusted (previously connected) to avoid popup spam
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log("Auto-connected:", response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
      }
    } catch (error) {
      // User hasn't connected yet, that's fine
    }
  };

  const connect = async () => {
    const { solana } = window;
    if (solana && solana.isPhantom) {
      try {
        const response = await solana.connect();
        console.log("Connected:", response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error("User rejected connection", err);
      }
    } else {
      alert("Phantom Wallet not found! Please install it.");
      window.open("https://phantom.app/", "_blank");
    }
  };

  const disconnect = async () => {
    const { solana } = window;
    if (solana) {
      await solana.disconnect();
      setWalletAddress(null);
    }
  };

  useEffect(() => {
    // Wait for window load to ensure extension is injected
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        publicKey,
        connected: !!walletAddress,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
