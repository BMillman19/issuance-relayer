import SetProtocol from 'setprotocol.js';
import * as Web3 from 'web3';

import { getProvider } from './provider';

// Kovan Config
const config = {
    coreAddress: '0x29f13822ece62b7a436a45903ce6d5c97d6e4cc9',
    setTokenFactoryAddress: '0x6c51d8dad8404dbd91e8ab063d21e85ddec9f626',
    transferProxyAddress: '0xd50ddfed470cc13572c5246e71d4cfb4aba73def',
    vaultAddress: '0x014e9b34486cfa13e9a2d87028d38cd98f996c8c',
};

let setProtocol = null;
export const getSetProtocolInstance = (): SetProtocol => {
    if (setProtocol) {
        return setProtocol;
    }
    const provider = getProvider();
    setProtocol = new SetProtocol(provider, config);
    return setProtocol;
};
