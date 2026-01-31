"use client";

// We use the dynamic import to avoid hydration errors with the wallet adapter UI
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const WalletButton = () => {
  return (
      <div className="rounded-full overflow-hidden">
        <WalletMultiButtonDynamic />
      </div>
  );
};
