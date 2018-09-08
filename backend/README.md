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
