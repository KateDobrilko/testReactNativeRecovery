import * as actionTypes from '../constants/actionTypes';
import * as websocketActions from '../actions/websocketActions';


const wesocketsMiddleware = (function () {
    var socket = null;

    const onOpen = (ws, store, token) => evt => {
        store.dispatch(websocketActions.connected());
    }

    const onClose = (ws, store) => evt => {
        store.dispatch(websocketActions.disconnected());
    }

    const onMessage = (ws, store) => evt => {
        var msg = JSON.parse(evt.data);
        store.dispatch(websocketActions.receiveWebsocketMessage(msg, socket));
    }

    return store => next => action => {
        switch (action.type) {
            case actionTypes.WEBSOCKET_ACTIONS.CONNECT_WEBSOCKETS:
            {
                if (socket != null) {
                    socket.close();
                }
                socket = new WebSocket(action.url);
                socket.onmessage = onMessage(socket, store);
                socket.onclose = onClose(socket, store);
                socket.onopen = onOpen(socket, store, action.token);
                break;
            }

            case actionTypes.WEBSOCKET_ACTIONS.SEND_MESSAGE:
            {
                store.dispatch(websocketActions.sendMessage(action.messageText, socket));
                break;
            }

            default:
            {
                return next(action);
            }
        }
    }
})();

export default wesocketsMiddleware;