import { Provider, RPCSubprovider, Web3ProviderEngine } from '@0xproject/subproviders';
import SetProtocol from 'setprotocol.js';

import { constants } from './constants';

const KOVAN_RPC_URL = 'https://kovan.infura.io/';

export const setProtocolFactory = {
    createSetProtocol(): SetProtocol {
        const providerEngine = new Web3ProviderEngine();
        const rpcSubprovider = new RPCSubprovider(KOVAN_RPC_URL);
        providerEngine.addProvider(rpcSubprovider);
        providerEngine.start();
        const setProtocol = new SetProtocol(providerEngine, {
            coreAddress: constants.SET_KOVAN_ADDRESSES.coreAddress,
            setTokenFactoryAddress: constants.SET_KOVAN_ADDRESSES.setTokenFactoryAddress,
            transferProxyAddress: constants.SET_KOVAN_ADDRESSES.transferProxyAddress,
            vaultAddress: constants.SET_KOVAN_ADDRESSES.vaultAddress,
        });
        return setProtocol;
    },
};
