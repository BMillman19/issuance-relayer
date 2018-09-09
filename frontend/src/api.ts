import { BigNumber } from '0x.js';
import { BACKEND_URL } from './constants';

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
};
