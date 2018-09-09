import {
    assetDataUtils,
    marketUtils,
    OrdersAndRemainingFillAmount,
    SignedOrder,
    sortingUtils,
} from '@0xproject/order-utils';
import { PrivateKeyWalletSubprovider, Provider, RPCSubprovider, Web3ProviderEngine } from '@0xproject/subproviders';
import { BigNumber } from '@0xproject/utils';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import wrap = require('express-async-wrap');
import * as _ from 'lodash';
import SetProtocol, { Address, SignedIssuanceOrder } from 'setprotocol.js';

import { constants } from './constants';
import { ZeroExOrderService } from './services/zero_ex_order_service';
import { setProtocolFactory } from './set_protocol_factory';

// TODO: Move this into constants.
const PUBLIC_ADDRESS = '0x89037cd54e3f96aadf9df8c2c59decd0b2c49fe3';

const KOVAN_RPC_URL = 'https://kovan.infura.io/';
const providerEngine = new Web3ProviderEngine();
const privateKey = process.env.PRIVATE_KEY as string;
const pkSubprovider = new PrivateKeyWalletSubprovider(privateKey);
const rpcSubprovider = new RPCSubprovider(KOVAN_RPC_URL);
providerEngine.addProvider(pkSubprovider);
providerEngine.addProvider(rpcSubprovider);
providerEngine.start();
const setProtocol = setProtocolFactory.createSetProtocol(providerEngine);

const BUFFER_MULTIPLIER = 1.2;

interface JsonSignedIssuanceOrder {
    setAddress: string;
    makerAddress: string;
    makerToken: string;
    relayerAddress: string;
    relayerToken: string;
    quantity: string;
    makerTokenAmount: string;
    expiration: string;
    makerRelayerFee: string;
    takerRelayerFee: string;
    salt: string;
    requiredComponents: string[];
    requiredComponentAmounts: string[];
    signature: {
        v: number | string;
        r: string;
        s: string;
    };
}

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use((req, res, next) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.get('/ping', (req: express.Request, res: express.Response) => {
    res.status(200).send('pong');
});
app.get('/sets', (req: express.Request, res: express.Response) => {
    const result = [
        {
            name: 'Stable Set',
            symbol: 'STBL',
            address: '0x2c58a14de96b522502857818e4dcc9b07a3993c4',
            naturalUnits: 10,
            components: [
                {
                    name: 'Dai',
                    symbol: 'DAI',
                    address: '0x1d82471142F0aeEEc9FC375fC975629056c26ceE',
                    units: 5,
                },
                {
                    name: 'TrueUSD',
                    symbol: 'TUSD',
                    address: '0xAdB015D61F4bEb2A712D237D9d4c5B75BAFEfd7B',
                    units: 5,
                },
            ],
        },
    ];
    res.status(200).send(JSON.stringify(result, null, 2));
});
app.get('/quote', async (req: express.Request, res: express.Response) => {
    /**
     * Params:
     * setAddress: string
     * quantity: string -> BigNumber
     *
     * Return:
     * makerTokenAmount -> string
     */
    const components = await setProtocol.setToken.getComponentsAsync(req.query.setAddress);
    const componentAmounts = await setProtocol.setToken.getUnitsAsync(req.query.setAddress);
    const quantity = new BigNumber(req.query.quantity);
    const targetOrdersArray = await getOrdersForComponentsAsync(components, componentAmounts, quantity);
    const totalCost = getCostForOrders(targetOrdersArray);
    const price = totalCost.div(quantity);
    const result = {
        totalCost,
        price,
    };
    res.status(200).send(JSON.stringify(result, null, 2));
});
app.post('/market_order', async (req: express.Request, res: express.Response) => {
    /**
     * Params:
     * issuance_order: JSONSignedIssuanceOrder
     * max_cost: BigNumber
     *
     * Return:
     * makerTokenAmount -> string
     */
    const issuanceOrder = unJSONifyOrder(req.body.issuance_order as JsonSignedIssuanceOrder);
    const targetOrdersArray = await getOrdersForComponentsAsync(
        issuanceOrder.requiredComponents,
        issuanceOrder.requiredComponentAmounts,
        issuanceOrder.quantity,
    );
    const maxCost = req.body.max_cost ? new BigNumber(req.body.max_cost) : 0;
    const totalCost = getCostForOrders(targetOrdersArray);
    if (totalCost.greaterThan(maxCost)) {
        throw new Error('Max cost exceeded');
    }
    const flattenedOrders = _.flatten(_.map(targetOrdersArray, targetOrders => targetOrders.resultOrders));
    const zeroExSignedFillOrders = _.map(flattenedOrders, order => ({
        ...order,
        takerTokenAmount: order.makerAssetAmount,
        takerTokenAddress: assetDataUtils.decodeERC20AssetData(order.makerAssetData).tokenAddress,
    }));
    const txHash = await setProtocol.orders.fillOrderAsync(
        issuanceOrder,
        issuanceOrder.quantity,
        zeroExSignedFillOrders,
        {
            from: PUBLIC_ADDRESS,
        },
    );
    const result = {
        txHash,
    };
    res.status(200).send(JSON.stringify(result, null, 2));
});
const DEFAULT_PORT = 8080;
const port = process.env.PORT || DEFAULT_PORT;
app.listen(port);

function unJSONifyOrder(jsonOrder: JsonSignedIssuanceOrder): SignedIssuanceOrder {
    return {
        setAddress: jsonOrder.setAddress,
        makerAddress: jsonOrder.makerAddress,
        makerToken: jsonOrder.makerToken,
        relayerAddress: jsonOrder.relayerAddress,
        relayerToken: jsonOrder.relayerToken,
        quantity: new BigNumber(jsonOrder.quantity),
        makerTokenAmount: new BigNumber(jsonOrder.makerTokenAmount),
        expiration: new BigNumber(jsonOrder.expiration),
        makerRelayerFee: new BigNumber(jsonOrder.makerRelayerFee),
        takerRelayerFee: new BigNumber(jsonOrder.takerRelayerFee),
        salt: new BigNumber(jsonOrder.salt),
        requiredComponents: jsonOrder.requiredComponents,
        requiredComponentAmounts: _.map(jsonOrder.requiredComponentAmounts, amount => new BigNumber(amount)),
        signature: {
            v: new BigNumber(jsonOrder.signature.v),
            r: jsonOrder.signature.r,
            s: jsonOrder.signature.s,
        },
    };
}

async function getOrdersForComponentsAsync(
    components: string[],
    componentAmounts: BigNumber[],
    quantity: BigNumber,
): Promise<Array<OrdersAndRemainingFillAmount<SignedOrder>>> {
    const tokenAssetDatas = _.map(components, address => assetDataUtils.encodeERC20AssetData(address));
    const orderbookRequests = _.map(tokenAssetDatas, assetData => {
        return {
            baseAssetData: assetData,
            quoteAssetData: constants.KOVAN_WETH_TOKEN_ASSET_DATA,
        };
    });
    const zeroExService = new ZeroExOrderService(providerEngine);
    const orderbooks = await Promise.all(_.map(orderbookRequests, request => zeroExService.getOrderbookAsync(request)));
    const asksList = _.map(orderbooks, orderbook => sortingUtils.sortOrdersByFeeAdjustedRate(orderbook.asks));
    const requiredAmounts = _.map(componentAmounts, amount => amount.mul(quantity).mul(BUFFER_MULTIPLIER));
    const targetOrdersArray = _.map(asksList, (asks, index) => {
        const requiredAmount = new BigNumber(requiredAmounts[index]);
        return marketUtils.findOrdersThatCoverMakerAssetFillAmount(asks, requiredAmount);
    });
    return targetOrdersArray;
}

function getCostForOrders(targetOrdersArray: Array<OrdersAndRemainingFillAmount<SignedOrder>>): BigNumber {
    let totalCost = new BigNumber(0);
    for (const targetOrders of targetOrdersArray) {
        for (const order of targetOrders.resultOrders) {
            totalCost = totalCost.add(order.takerAssetAmount);
        }
    }
    return totalCost;
}
