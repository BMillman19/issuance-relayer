import { orderHashUtils, signatureUtils } from '@0xproject/order-utils';
import { PrivateKeyWalletSubprovider, Provider, Web3ProviderEngine } from '@0xproject/subproviders';
import { Order, SignedOrder, SignerType } from '@0xproject/types';
import { BigNumber } from '@0xproject/utils';
import { Web3Wrapper } from '@0xproject/web3-wrapper';
import * as _ from 'lodash';

import { constants } from '../constants';

const PUBLIC_ADDRESS = '0x89037cd54e3f96aadf9df8c2c59decd0b2c49fe3';
const EXCHANGE_ADDRESS = '0x35dd2932454449b14cee11a94d3674a936d5d7b2';

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
    private _provider: Provider;
    constructor(provider: Provider) {
        this._provider = provider;
    }
    public async getOrderbookAsync(request: OrderbookRequest): Promise<OrderbookResponse> {
        const order: Order = {
            senderAddress: constants.NULL_ADDRESS,
            makerAddress: PUBLIC_ADDRESS,
            takerAddress: constants.NULL_ADDRESS,
            makerFee: constants.ZERO_AMOUNT,
            takerFee: constants.ZERO_AMOUNT,
            makerAssetAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(195000), 18),
            takerAssetAmount: Web3Wrapper.toBaseUnitAmount(new BigNumber(1000), 18),
            makerAssetData: request.baseAssetData,
            takerAssetData: constants.KOVAN_WETH_TOKEN_ASSET_DATA,
            salt: new BigNumber(Date.now()),
            exchangeAddress: EXCHANGE_ADDRESS,
            feeRecipientAddress: constants.NULL_ADDRESS,
            expirationTimeSeconds: new BigNumber(Date.now() + 1000000000000000),
        };
        const orderHash = orderHashUtils.getOrderHashHex(order);
        const signature = await signatureUtils.ecSignOrderHashAsync(
            this._provider,
            orderHash,
            PUBLIC_ADDRESS,
            SignerType.Default,
        );
        const signedOrder: SignedOrder = {
            signature,
            ...order,
        };
        const bids = [] as SignedOrder[];
        const asks = [signedOrder];
        return {
            bids,
            asks,
        };
    }
}
