import * as bodyParser from 'body-parser';
import * as express from 'express';

const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.get('/ping', (req: express.Request, res: express.Response) => {
    res.status(200).send('pong');
});
const DEFAULT_PORT = 3000;
const port = process.env.PORT || DEFAULT_PORT;
app.listen(port);
