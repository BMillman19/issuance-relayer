import { assetDataUtils, marketUtils, sortingUtils } from '@0xproject/order-utils';
import { BigNumber } from '@0xproject/utils';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as _ from 'lodash';

import { constants } from './constants';
import { ZeroExOrderService } from './services/zero_ex_order_service';
import { setProtocolFactory } from './set_protocol_factory';

const BUFFER_MULTIPLIER = 1.2;

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
    const setProtocol = setProtocolFactory.createSetProtocol();
    const components = await setProtocol.setToken.getComponentsAsync(req.params.setAddress);
    const tokenAssetDatas = _.map(components, address => assetDataUtils.encodeERC20AssetData(address));
    const orderbookRequests = _.map(tokenAssetDatas, assetData => {
        return {
            baseAssetData: assetData,
            quoteAssetData: constants.KOVAN_WETH_TOKEN_ASSET_DATA,
        };
    });
    const zeroExService = new ZeroExOrderService();
    const orderbooks = await Promise.all(_.map(orderbookRequests, request => zeroExService.getOrderbookAsync(request)));
    const asksList = _.map(orderbooks, orderbook => sortingUtils.sortOrdersByFeeAdjustedRate(orderbook.asks));
    const units = await setProtocol.setToken.getUnitsAsync(req.params.setAddress);
    const quantity = new BigNumber(req.params.quantity);
    const requiredAmounts = _.map(units, unit => unit.mul(quantity).mul(BUFFER_MULTIPLIER));
    const targetOrdersArray = _.map(asksList, (asks, index) => {
        const requiredAmount = requiredAmounts[index];
        return marketUtils.findOrdersThatCoverMakerAssetFillAmount(asks, requiredAmount);
    });
    const totalCost = new BigNumber(0);
    for (const targetOrders of targetOrdersArray) {
        for (const order of targetOrders.resultOrders) {
            totalCost.add(order.takerAssetAmount);
        }
    }
    const price = totalCost.div(quantity);
    const result = {
        totalCost,
        price,
    };
    res.status(200).send(JSON.stringify(result, null, 2));
});
const DEFAULT_PORT = 8080;
const port = process.env.PORT || DEFAULT_PORT;
app.listen(port);
