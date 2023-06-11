import { Flipside, QueryResultSet, Query } from "@flipsidecrypto/sdk";

const FLIPSIDE_API_KEY = process.env.REACT_APP_API_KEY;
const API_BASE_URL = process.env.REACT_APP_FLIPSIDE_API_BASE_URL; 

export async function getFees(address: string): Promise<[QueryResultSet | null, Error | null]>  {
    if (!FLIPSIDE_API_KEY) throw new Error("no api key"); 

    // Create an instance of the API 
    const flipside = new Flipside(FLIPSIDE_API_KEY, API_BASE_URL); 

        const query: Query = {
          sql: `
              WITH base AS (
                SELECT 
                  num_txs, 
                  total_fees / POW(10, 9) as fees_sol, 
                  total_fees / num_txs as avg_fees_lamports
                FROM solana.core.ez_signers s 
                WHERE signer = '${address}'
              ), 
              price AS (
                SELECT 
                  price, 
                  HOUR
                FROM crosschain.core.ez_hourly_prices
                WHERE symbol = 'SOL'
                ORDER BY HOUR DESC 
                LIMIT 1
              )
              SELECT 
                num_txs, 
                fees_sol, 
                fees_sol * price as tot_fee_usd, 
                avg_fees_lamports, 
                avg_fees_lamports / POW(10, 9) * price as avg_fee_usd
              FROM base
              JOIN price
          `, 
          ttlMinutes: 2,
        }; 

    const result = await flipside.query.run(query); 
    if (result.error) {
        return [null, result.error]; 
    }

    return [result, null]
}