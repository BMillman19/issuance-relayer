import * as bodyParser from 'body-parser';
import * as express from 'express';

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
const DEFAULT_PORT = 8080;
const port = process.env.PORT || DEFAULT_PORT;
app.listen(port);
