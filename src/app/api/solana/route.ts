import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAccount } from "@solana/spl-token";
import { NextResponse } from "next/server";

// Use the environment variable, valid on server side
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com";
const connection = new Connection(RPC_URL, "confirmed");

// Devnet USDC Mints (Circle & Faucet)
const USDC_MINTS = [
    new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"), // Circle
    new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr")  // SPL Faucet
];

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (body.action === "getLatestBlockhash") {
            const { blockhash } = await connection.getLatestBlockhash();
            return NextResponse.json({ blockhash });
        }

        if (body.action === "buildUsdcTransaction") {
            const { userAddress, amount, destinationAddress } = body;
            const userPubkey = new PublicKey(userAddress);
            const destPubkey = new PublicKey(destinationAddress);

            let selectedMint = null;
            let userAta = null;

            // 1. Find which USDC Mint the user has
            for (const mint of USDC_MINTS) {
                const ata = await getAssociatedTokenAddress(mint, userPubkey);
                const info = await connection.getAccountInfo(ata);
                if (info) {
                    // Check balance? For now just existence is a strong enough signal used with error handling
                    // We could decode data but let's assume if ATA exists, that's the one they use
                    // Better: Check if it has enough balance? That requires parsing.
                    // Let's stick to existence for the MVP fix.
                    selectedMint = mint;
                    userAta = ata;
                    break;
                }
            }

            if (!selectedMint || !userAta) {
                return NextResponse.json({
                    error: `No USDC found. specific mints checked: ${USDC_MINTS.map(m => m.toString()).join(", ")}`
                }, { status: 400 });
            }

            const destAta = await getAssociatedTokenAddress(selectedMint, destPubkey, true); // Allow off-curve

            // 3. Create Transaction
            const transaction = new Transaction();

            // 4. Check if Destination ATA exists for THIS mint
            const destAccountInfo = await connection.getAccountInfo(destAta);

            if (!destAccountInfo) {
                // Destination ATA missing, create it!
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        userPubkey, // Payer
                        destAta,    // Associated Account
                        destPubkey, // Owner
                        selectedMint   // Mint
                    )
                );
            }

            // Amount in USDC (6 decimals)
            const usdcAmount = Math.floor(parseFloat(amount) * 1_000_000);

            transaction.add(
                createTransferInstruction(
                    userAta,
                    destAta,
                    userPubkey,
                    usdcAmount,
                    [],
                    TOKEN_PROGRAM_ID
                )
            );

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = userPubkey;

            return NextResponse.json({
                tx: transaction.serialize({ requireAllSignatures: false }).toString('base64')
            });
        }

        if (body.action === "sendTransaction") {
            // Expecting base64 encoded transaction
            const txBuffer = Buffer.from(body.tx, 'base64');
            const signature = await connection.sendRawTransaction(txBuffer);

            // Optionally wait for confirmation here or let frontend do it polling
            // Choosing to wait for 'confirmed' here for simplicity, 
            // though for speed might want to return immediately.
            // Let's return signature immediately to keep UI responsive? 
            // No, user assumes success only after confirm.

            const confirmation = await connection.confirmTransaction(signature, "confirmed");
            if (confirmation.value.err) {
                throw new Error("Transaction failed on-chain");
            }

            return NextResponse.json({ signature });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (e: any) {
        console.error("Solana Proxy Error:", e);
        return NextResponse.json({ error: e.message || "RPC Error" }, { status: 500 });
    }
}
