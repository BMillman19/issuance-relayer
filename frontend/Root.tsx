import * as React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import App from './App';
import { accountReducer } from './redux/reducers';

const store = createStore(
    accountReducer,
    compose(applyMiddleware(thunkMiddleware)),
);

const Root = () => (
    <Provider store={store}>
      <App />
    </Provider>
);

export default Root;
