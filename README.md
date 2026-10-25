# sui faucet

## what is it?

its a simple testnet faucet for the sui blockchain which gives gas fees enough to cover multiple transactions 

**the buzwords:** blockchains basically charge a small fee(mostly called "gas" fees across multiple chains) for every action you want to do on the chain. when developers write blockchain stuff(called "smart contracts"), before shipping production grade code they deploy the code on _testnet_, which is basically _mainnet_(where the real stuff happens) but with fake money(in this case, called testnet sui). a _faucet_ is like a tap that hands out testnet tokens for free.

**live demo:** https://sui-faucet-seven.vercel.app



## usage
open the link in yo browser

paste wallet address

click "Give me gas!"

and there you go.


## how to reproduce this setup?
you'll need node downloaded, a vercel account, upstash redis for db(vercel has this), a cloudflare account for the turnstile keys, and a sui wallet funded with testnet sui(feel free to farm sui from my faucet lol)

make sure to use a fresh throwaway wallet that DOES not have real money

copy the commands:

```bash
git clone https://github.com/subhaintdead/sui-faucet
cd sui-faucet
npm install
cp .env.example .env

```
and then if youre running it locally, add your credentials in `.env`, and change the `data-sitekey` from `index.html` with your sitekey.

```bash
npx vercel dev
```


## how does it work?

browser -> address validation--> check captcha/cooldown --> sends sui --> updates claim time

built using vanilla html/css/js, vercel serverless functions, and 

@mysten/sui/grpc, 
@mysten/sui/keypairs/ed25519, 
@mysten/sui/transactions, 
@upstash/redis

**AI USAGE: ai has been used to debug and for code suggestions. this was a small project with not much polish as i had to ship fast**
