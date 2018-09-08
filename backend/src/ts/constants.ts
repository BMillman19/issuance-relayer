import { assetDataUtils } from '@0xproject/order-utils';

export const constants = {
    SET_KOVAN_ADDRESSES: {
        coreAddress: '0x29f13822ece62b7a436a45903ce6d5c97d6e4cc9',
        erc20Proxy: '0x5bc0de240e1c1b211538ca077a82bb39f4179087',
        setTokenFactoryAddress: '0x6c51d8dad8404dbd91e8ab063d21e85ddec9f626',
        transferProxyAddress: '0xd50ddfed470cc13572c5246e71d4cfb4aba73def',
        vaultAddress: '0x014e9b34486cfa13e9a2d87028d38cd98f996c8c',
        zeroExExchange: '0xb65619b82c4d385de0c5b4005452c2fdee0f86d1',
        setTokenAddress: '0x2c58a14de96b522502857818e4dcc9b07a3993c4',
        daiAddress: '0x1d82471142F0aeEEc9FC375fC975629056c26ceE',
        trueUsdAddress: '0xAdB015D61F4bEb2A712D237D9d4c5B75BAFEfd7B',
        wethAddress: '0xd0A1E359811322d97991E03f863a0C30C2cF029C',
    },
    KOVAN_WETH_TOKEN_ASSET_DATA: assetDataUtils.encodeERC20AssetData('0xd0a1e359811322d97991e03f863a0c30c2cf029c'),
};
