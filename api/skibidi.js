import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: Process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});

const client = new SuiClient({ url: getfullnodeUrl('testnet') });

const cooldown = 6.7 * 60 * 60;
const amount = 10_000_000; // equals to 0.01 sui, enough for gas for multiple transactions



export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'not allowed' });
    }

    const { address, token } = req.body;

    if (!address || !address.startsWith('0x') || address.length < 64) {
        return res.status(400).json({ error: 'invalid sui address' });



    }

}