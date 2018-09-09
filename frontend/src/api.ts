import { BigNumber } from '0x.js';
import { BACKEND_URL, BIG_E18 } from './constants';
import { SignedIssuanceOrder } from 'setprotocol.js';

import { web3Wrapper } from './web3Wrapper';

export const api = {
    getQuote: async (setAddress: string, quantity: BigNumber): Promise<{ totalCost: BigNumber; price: BigNumber }> => {
        const url = `${BACKEND_URL}/quote?setAddress=${setAddress}&quantity=${quantity}`;
        const res = await fetch(url);
        const { totalCost, price } = await res.json();
        return {
            totalCost: new BigNumber(totalCost).mul(BIG_E18).floor(),
            price: new BigNumber(price).mul(BIG_E18).floor(),
        };
    },
    postMarketOrder: async (issuanceOrder: SignedIssuanceOrder, maxCost: BigNumber): Promise<{ txHash: string }> => {
        const url = `${BACKEND_URL}/market_order`;
        const res = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify({
                issuance_order: issuanceOrder,
                max_cost: maxCost,
            }), // body data type must match "Content-Type" header
        });
        const resJson = await res.json();
        const txn = await web3Wrapper.awaitTransactionMinedAsync(resJson.txHash);
        console.log(txn);
    },
};
