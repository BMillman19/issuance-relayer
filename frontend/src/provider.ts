import * as Web3 from 'web3';
import { Provider } from '0x.js';

export const getProvider = (): Provider => {
    const injectedWeb3 = (window as any).web3 || undefined;
    let provider;
    try {
        // Use MetaMask/Mist provider
        return injectedWeb3.currentProvider;
    } catch (err) {
        // Throws when user doesn't have MetaMask/Mist running
        throw new Error(`No injected web3 found when initializing setProtocol: ${err}`);
    }
};
