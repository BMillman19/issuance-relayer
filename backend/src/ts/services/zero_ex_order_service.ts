import { SignedOrder } from '@0xproject/types';

export interface OrderbookRequest {
    baseAssetData: string;
    quoteAssetData: string;
}

export interface OrderbookResponse {
    bids: SignedOrder[];
    asks: SignedOrder[];
}

export interface IZeroExOrderService {
    getOrderbookAsync: (request: OrderbookRequest) => Promise<OrderbookResponse>;
}

export class ZeroExOrderService implements IZeroExOrderService {
    public async getOrderbookAsync(request: OrderbookRequest): Promise<OrderbookResponse> {
        const bids = [] as SignedOrder[];
        const asks = [] as SignedOrder[];
        return {
            bids,
            asks,
        };
    }
}
