## issuance-relayer-service

Set of endpoints to manage issuance orders

### Install dependencies

```bash
yarn install
```

### Build

```bash
yarn build
```

Or continuously rebuild on change:

```bash
yarn dev
```

### Clean

```bash
yarn clean
```

### Lint

```bash
yarn lint
```

### Start

```bash
yarn dev
```

### Endpoints

`GET /ping`

Returns `pong`

`GET /sets`

Returns json array of available sets. Example:

```
[
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
]
```

### Docker configs

```
docker run -d \
-p 80:3000 \
--name issuance-relayer-service \
--log-opt max-size=100m \
--log-opt max-file=20 \
-e SOME_ENV_VAR=$SOME_ENV_VAR \
issuance-relayer-service
```
