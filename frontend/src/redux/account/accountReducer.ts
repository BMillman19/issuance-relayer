import { UPDATE_ACCOUNT } from './accountActions';

const initialState = {
  account: {
    address: '',
    balances: {},
  }
};

export const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ACCOUNT:
      return {
        account: action.payload,
      };
    default:
      return state;
  }
};
