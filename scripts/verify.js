const fetch = require('node-fetch'); // or native fetch in newer node

async function verify() {
    const baseUrl = 'http://localhost:3000/api';
    
    console.log("1. Fetching Markets...");
    try {
        const res = await fetch(`${baseUrl}/markets`);
        const markets = await res.json();
        const market = markets[0];
        console.log(`   Market 1: Yes=${market.liquidityYes}, No=${market.liquidityNo}, Price=${market.yesPrice}`);
        
        console.log("2. Executing Trade (Buy YES 1000)...");
        const tradeRes = await fetch(`${baseUrl}/trade`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                marketId: 1,
                side: 'YES',
                amount: 1000,
                // Valid sample Solana address
                userAddress: '8P2f6K6w6f6K6w6f6K6w6f6K6w6f6K6w6f6K6w6f6K6w',
                isPrivate: false
            })
        });
        const tradeResult = await tradeRes.json();
        console.log(`   Trade Result: ${JSON.stringify(tradeResult)}`);
        
        console.log("3. Verifying New State...");
        const res2 = await fetch(`${baseUrl}/markets`);
        const markets2 = await res2.json();
        const market2 = markets2[0];
        console.log(`   Market 1: Yes=${market2.liquidityYes}, No=${market2.liquidityNo}, Price=${market2.yesPrice}`);
        
        if (market2.yesPrice > market.yesPrice) {
            console.log("SUCCESS: Price increased as expected.");
        } else {
            console.log("FAILURE: Price did not increase.");
        }
    } catch (e) {
        console.error("Verification failed:", e);
    }
}

verify();
