import * as actionTypes from '../constants/actionTypes';
import * as globalConstants from '../constants/globalConstants';
var messagesPage = 0;
var md5 = require('md5');
var PushNotification = require('react-native-push-notification');

PushNotification.configure({
    onNotification: function (notification) {
    }
});

export function getAsyncValue(name, callback, ...parameters) {
    return dispatch => {
        dispatch(requestGetAsyncStorageValue(name));
        return AsyncStorage.getItem(name)
            .then(value => dispatch(receiveGetAsyncStorageValue(callback, ...parameters).bind(value)))
    }
}
export function setAsyncValue(name, value, callback, ...parameters) {
    return dispatch => {
        dispatch(requestSetAsyncStorageValue(name, value));
        AsyncStorage.setItem(name, value).then(value => dispatch(receiveSetAsyncStorageValue(callback, ...parameters)));
    }
}

function requestGetAsyncStorageValue(name) {
    return {
        type: actionTypes.ASYNC_STORAGE_ACTIONS.REQUEST_GET_VALUE,
        name
    }
}

function receiveGetAsyncStorageValue(value, callback, ...parameters) {
    return (dispatch) => {
        return dispatch(callback(value, ...parameters));
    }
}

function requestSetAsyncStorageValue(name, value) {
    return {
        type: actionTypes.ASYNC_STORAGE_ACTIONS.REQUEST_SET_VALUE,
        name,
        value
    }
}

function receiveSetAsyncStorageValue(callback, ...parameters) {
    return (dispatch) => {
        return dispatch(callback(...parameters));
    }
}


export function requestMessages(authToken, roomId) {
    return {
        type: actionTypes.ROOM_ACTIONS.REQUEST_MESSAGES,
        authToken,
        roomId
    }
}

export function receiveMessages(messages) {
    return {
        type: actionTypes.ROOM_ACTIONS.RECEIVE_MESSAGES,
        messages
    }
}

function fetchMessages(state, authToken) {
    return dispatch => {
        dispatch(requestMessages(authToken))
        return fetch('http://chat.exposit-ds.com/messages/room=' + state.currentRoomId + '?page=' + messagesPage,
            {
                method: 'GET',
                headers: {
                    [globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN]: authToken
                }
            })
            .then(response => response.json())
            .then(json => {
                dispatch(receiveMessages(json['messages']));
                messagesPage++;
            })
    }
}


function shouldFetchMessages(state) {
    const messages = state.messages;
    if (!messages) {
        return true
    } else if (messages.messageListIsFetching) {
        return false
    } else {
        return messages.messageListDidInvalidate
    }
}

export function invalidateMessageList() {
    return {
        type: actionTypes.MESSAGE_ACTIONS.INVALIDATE_MESSAGE_LIST
    }
}

export function fetchMessagesIfNeeded() {
    return (dispatch, getState) => {
        let processFetchMessagesIfNeededParameters = [dispatch, getState];
        let getAuthTokenParameters =
            [globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN,
                processFetchMessagesIfNeeded, ...processFetchMessagesIfNeededParameters];
        return dispatch(getAsyncValue
        (...getAuthTokenParameters));
    }
}

function processFetchMessagesIfNeeded(authToken, roomId) {
    return (dispatch, getState) => {
        if (shouldFetchMessages(getState(), authToken, roomId)) {
            return dispatch(fetchMessages(getState(), authToken))
        }
    }
}

export function requestRooms(authToken) {
    return {
        type: actionTypes.ROOM_ACTIONS.REQUEST_ROOMS,
        authToken
    }
}

export function receiveRooms(rooms, callback, ...parameters) {
    if (callback) {
        callback(...parameters).bind(rooms);
    }
    return {
        type: actionTypes.ROOM_ACTIONS.RECEIVE_ROOMS,
        rooms: rooms
    }
}

function fetchRooms(authToken, callback, ...parameters) {
    return dispatch => {
        dispatch(requestRooms(authToken))
        return fetch('http://chat.exposit-ds.com/user/room/all',
            {
                method: 'GET',
                headers: {
                    [globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN]: authToken
                }
            })
            .then(response => response.json())
            .then(json => dispatch(receiveRooms(json['rooms'], callback, ...parameters)))
    }
}

function shouldFetchRooms(state) {
    const rooms = state.rooms;
    if (!rooms) {
        return true
    } else if (rooms.roomListIsFetching) {
        return false
    } else {
        return rooms.roomListDidInvalidate
    }
}

export function selectListType(listType) {
    return {
        type: actionTypes.SELECT_LIST_TYPE,
        listType
    }
}

export function selectRoom(room) {
    return {
        type: actionTypes.ROOM_ACTIONS.SELECT_ROOM,
        room
    }
}

export function invalidateRoomList() {
    return {
        type: actionTypes.ROOM_ACTIONS.INVALIDATE_ROOM_LIST
    }
}

export function fetchRoomsIfNeeded() {
    return (dispatch, getState) => {
        let processFetchRoomsIfNeededParameters = [dispatch, getState];
        let getAuthTokenParameters =
            [globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN,
                processFetchRoomsIfNeeded, ...processFetchRoomsIfNeededParameters];
        return dispatch(getAsyncValue
        (...getAuthTokenParameters));
    }
}

function processFetchRoomsIfNeeded(authToken, callback, ...parameters) {
    return (dispatch, getState) => {
        if (shouldFetchRooms(getState(), authToken)) {
            return dispatch(fetchRooms(authToken, callback, ...parameters))
        }
    }
}

export function selectUser(user) {
    return {
        type: actionTypes.USER_ACTIONS.SELECT_USER,
        user
    }
}

export function invalidateUserList() {
    return {
        type: actionTypes.USER_ACTIONS.INVALIDATE_USER_LIST
    }
}

export function fetchUsersIfNeeded() {
    return (dispatch, getState) => {
        let processFetchUsersIfNeededParameters = [dispatch, getState];
        let getAuthTokenParameters =
            [globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN,
                processFetchUsersIfNeeded, ...processFetchUsersIfNeededParameters];
        return dispatch(getAsyncValue
        (...getAuthTokenParameters));
    }
}

function processFetchUsersIfNeeded(dispatch, getState) {
    if (shouldFetchUsers(getState())) {
        return dispatch(fetchUsers(this.authToken))
    }
}

export function requestUsers(authToken) {
    return {
        type: actionTypes.USER_ACTIONS.REQUEST_USERS,
        authToken
    }
}

export function receiveUsers(users) {
    return {
        type: actionTypes.USER_ACTIONS.RECEIVE_USERS,
        users: users
    }
}

function fetchUsers(authToken) {
    return dispatch => {
        dispatch(requestUsers(authToken));
        return fetch('http://chat.exposit-ds.com/account/users',
            {
                method: 'GET',
                headers: {
                    [globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN]: authToken
                }
            }).then(response => response.json())
            .then(json => dispatch(receiveUsers(json['employers'])))
    }
}

function shouldFetchUsers(state) {
    const users = state.users;
    if (!users) {
        return true
    } else if (users.userListIsFetching) {
        return false
    } else {
        return users.userListDidInvalidate
    }
}

export function receiveWebsocketMessage(message, socket) {
    return (dispatch, getState) => {
        switch (message.event) {
            case globalConstants.WEBSOCKET_EVENTS.JOIN_ROOMS:
            {
                let joinRoomsParameters = [message, socket];
                let getConnectionTokenParameters =
                    [globalConstants.ASYNC_STORAGE_VALUES.CONNECTION_TOKEN,
                        onJoinRooms,
                        ...joinRoomsParameters];
                let getAuthTokenParameters = [
                    globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN,
                    getAsyncValue,
                    ...getConnectionTokenParameters
                ];
                dispatch(getAsyncValue
                (...getAuthTokenParameters));
                break;
            }
            case globalConstants.WEBSOCKET_EVENTS.SOCKET_INIT_MSG:
            {
                let onSocketInitMessageParameters = [message, socket];
                let setConnectionTokenParameters =
                    [
                        globalConstants.ASYNC_STORAGE_VALUES.CONNECTION_TOKEN,
                        message[globalConstants.ASYNC_STORAGE_VALUES.CONNECTION_TOKEN],
                        onSocketInitMessage,
                        ...onSocketInitMessageParameters
                    ];
                let getAuthTokenParameters = [
                    globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN,
                    setAsyncValue,
                    ...setConnectionTokenParameters
                ];
                dispatch(getAsyncValue
                (...getAuthTokenParameters));
                break;
            }
            case globalConstants.WEBSOCKET_EVENTS.USER_MESSAGE:
            {
                let onChatMessageParameters = [getState(), message, socket];
                let setConnectionTokenParameters =
                    [
                        globalConstants.ASYNC_STORAGE_VALUES.CONNECTION_TOKEN,
                        message[globalConstants.ASYNC_STORAGE_VALUES.CONNECTION_TOKEN],
                        onChatMessage,
                        ...onChatMessageParameters
                    ];
                let setAuthTokenParameters = [
                    globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN,
                    message[globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN],
                    setAsyncValue,
                    ...setConnectionTokenParameters
                ];
                dispatch(setAsyncValue
                (...setAuthTokenParameters));
                break;
            }
        }
    }
}

function onJoinRooms(message, socket) {
    var newData = {
        event: globalConstants.WEBSOCKET_EVENTS.REQUEST_USERS_ONLINE,
        userId: message["userId"],
        authToken: this[globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN],
        connectionToken: this[globalConstants.ASYNC_STORAGE_VALUES.CONNECTION_TOKEN]
    };
    socket.send(JSON.stringify(newData));
}
function onSocketInitMessage(socket) {
    let joinRoomsParameters = [
        this[globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN],
        this[globalConstants.ASYNC_STORAGE_VALUES.CONNECTION_TOKEN],
        socket
    ];
    return dispatch => {
        dispatch(fetchRoomsIfNeeded
            (
                this[globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN],
                joinRooms,
                ...joinRoomsParameters)
        );
    };
}

function joinRooms(authToken, connectionToken, socket) {
    var data = {
        event: globalConstants.WEBSOCKET_EVENTS.JOIN_ROOMS,
        userId: null,
        connectionToken,
        authToken
    };
    let roomIds = [];
    this.rooms.forEach(room => {
        roomIds.push(room.id);
    });
    data['roomIds'] = roomIds;
    socket.send(JSON.stringify(data));
}

function onChatMessage(state, message) {
    PushNotification.localNotification({
        vibrate: true,
        vibration: 300,
        title: "My Notification Title",
        message: "New Message Income",
        playSound: true,
        soundName: 'default',
        number: '1'
    });
    var messages = state.messages.messageListItems.push(message);
    return dispatch => {
        dispatch(receiveMessages(messages))
    };
}

export function sendMessageUI(messageText) {
    return {
        type: actionTypes.WEBSOCKET_ACTIONS.SEND_MESSAGE_UI,
        messageText
    }
}

export function sendMessage(messageText, socket) {
    return (dispatch, getState) => {
        let processSendMessageParameters = [messageText, socket, getState()];
        let getConnectionTokenParameters =
            [globalConstants.ASYNC_STORAGE_VALUES.CONNECTION_TOKEN,
                processSendMessage,
                ...processSendMessageParameters];
        let getAuthTokenParameters = [
            globalConstants.ASYNC_STORAGE_VALUES.AUTH_TOKEN,
            getAsyncValue,
            ...getConnectionTokenParameters
        ];
        dispatch(getAsyncValue
        (...getAuthTokenParameters));
    }
}

function processSendMessage(messageText, socket, state) {
    var message = {
        content: messageText,
        date: '',
        event: globalConstants.MESSAGE_TYPES.USER_MESSAGE,
        firstName: '',
        hash: md5(messageText),
        lastName: '',
        roomId: state.currentRoomId,
        type: globalConstants.MESSAGE_TYPES.TEXT_TYPE,
        authToken: this.authToken,
        connectionToken: this.connectionToken
    };
    socket.send(JSON.stringify(message));
}