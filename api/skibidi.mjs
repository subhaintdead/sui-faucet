import { SuiGrpcClient } from '@mysten/sui/grpc';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});

const client = new SuiGrpcClient({
    network: 'testnet',
    url: 'https://fullnode.testnet.sui.io:443',

});

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

    const turnstileRes = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                secret: process.env.TURNSTILE_SECRET,
                response: token,
            }),
        }
    );

    const turnstileData = await turnstileRes.json();
    if (!turnstileData.success) {
        return res.status(400).json({ error: 'captcha failed, please try again' });
    }

    const rateLimitKey = `faucet:${address.toLowerCase()}`;
    const lastClaim = await redis.get(rateLimitKey);
    if (lastClaim) {
        const secondsleft = Math.ceil(
            cooldown - (Date.now() / 1000 - Number(lastClaim))

        );

        const hoursleft = (secondsleft / 3600).toFixed(1);
        return res.status(429).json({
            error: `chill gng, come back in ${hoursleft} hours`,

        });
    }

    try {
        const keypair = Ed25519Keypair.fromSecretKey(process.env.SUI_PRIVATE_KEY.trim);

        const tx = new Transaction();
        const [coin] = tx.splitCoins(tx.gas, [amount]);
        tx.transferObjects([coin], address);

        const result = await keypair.signAndExecuteTransaction({
            transaction: tx,
            client,
        });


        await redis.set(rateLimitKey, Math.floor(Date.now() / 1000), {
            ex: Math.ceil(cooldown),

        });
        return res.status(200).json({ txHash: result.digest });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'transaction failed, faucet is ded' })
    }
}

