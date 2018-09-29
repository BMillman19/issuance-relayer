import { Web3Wrapper } from '@0xproject/web3-wrapper';

import { getProvider } from './getProvider';

export const web3Wrapper = new Web3Wrapper(getProvider());
