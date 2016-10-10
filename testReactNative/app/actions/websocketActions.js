import * as asyncStorageActions from './asyncStorageActions';
import * as globalConstants from '../constants/globalConstants';
import * as messageActions from './messageActions';
import * as roomActions from './roomActions';
import * as actionTypes from '../constants/actionTypes';


export function connectWebsockets() {
    return {
        type: actionTypes.WEBSOCKET_ACTIONS.CONNECT_WEBSOCKETS
    }
}