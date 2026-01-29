import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

export class Web3Adapter {
    private connection: Connection;
    private network: string;

    constructor(network: string = "https://api.devnet.solana.com") {
        this.connection = new Connection(network, "confirmed");
        this.network = network;
    }

    // Mock function to simulate a transfer instruction creation
    async createTransferTransaction(
        fromPubkey: PublicKey,
        toPubkey: PublicKey,
        amount: number
    ): Promise<Transaction> {
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey,
                toPubkey,
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );

        // In a real backend, we might add a memo or other instructions here
        // For now, we return the transaction object to be signed by the client (if partial sign) 
        // or just used for simulation logic structure.

        // Check latest blockhash
        const { blockhash } = await this.connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = fromPubkey;

        return transaction;
    }

    async getBalance(pubkey: PublicKey): Promise<number> {
        return this.connection.getBalance(pubkey);
    }

    // Helper to validate address
    isValidAddress(address: string): boolean {
        try {
            new PublicKey(address);
            return true;
        } catch (e) {
            return false;
        }
    }
}

export const pnpAdapter = new Web3Adapter();
