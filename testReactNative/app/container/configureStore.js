import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers/rootReducer';
import websocketsMiddleware from '../middleware/websocketMiddleware';

export default function configureStore(preloadedState) {
    console.log(rootReducer);
    return createStore(
        rootReducer,
        preloadedState,
        applyMiddleware(
            thunkMiddleware,
            websocketsMiddleware)
    );
}