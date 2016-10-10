import React, {Component} from 'react';
import {Provider} from 'react-redux';
import RootRouter from '../components/router/rootRouter';
import configureStore from './configureStore'

const store = configureStore();
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