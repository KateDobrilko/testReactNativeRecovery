import React, {Component} from 'react';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import * as reducers from '../reducers';
import RootRouter from '../components/router/rootRouter';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default class testReactNative extends Component {

    render() {
        console.disableYellowBox = true;
        return (
            <Provider store = {store}>
                <RootRouter/>
            </Provider>
        );
    }
}