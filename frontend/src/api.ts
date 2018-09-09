import { BigNumber } from '0x.js';
import { BACKEND_URL } from './constants';
import { SignedIssuanceOrder } from 'setprotocol.js';

import { getSetProtocolInstance } from './setProtocol';

const setProtocol = getSetProtocolInstance();

export const api = {
    getQuote: async (setAddress: string, quantity: BigNumber): Promise<{ totalCost: BigNumber; price: BigNumber }> => {
        const url = `${BACKEND_URL}/quote?setAddress=${setAddress}&quantity=${quantity}`;
        const res = await fetch(url);
        const { totalCost, price } = await res.json();
        return {
            totalCost: new BigNumber(totalCost),
            price: new BigNumber(price),
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
        const { txHash } = await res.json();
        const txn = await setProtocol.awaitTransactionMinedAsync(txHash);
        console.log(txn);
    },
};
