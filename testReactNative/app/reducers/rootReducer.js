import * as actionTypes from '../constants/actionTypes';

import {combineReducers} from 'redux';

function selectedChatRoom(state = '', action) {
    switch (action.type) {
        case actionTypes.ROOM_ACTIONS.SELECT_ROOM:
            return action.roomId;
        case actionTypes.USER_ACTIONS.SELECT_USER:
            return action.privateRoomId;
        default:
            return state
    }
}

function websocket(state = {}, action) {
    switch (action.type) {
        case actionTypes.WEBSOCKET_ACTIONS.CONNECT_WEBSOCKETS:
            return {
                ...state
            };
        case actionTypes.WEBSOCKET_ACTIONS.SEND_MESSAGE_UI:
            return {
                ...state
            };
        default:
            return {
                ...state
            };
    }
}

function users(state = {
    userListIsFetching: false,
    userListDidInvalidate: false,
    userListItems: []
}, action) {

    switch (action.type) {

        case actionTypes.USER_ACTIONS.INVALIDATE_USER_LIST:
            return {
                ...state,
                userListDidInvalidate: true
            };
        case actionTypes.USER_ACTIONS.REQUEST_USERS:
            return {
                ...state,
                userListIsFetching: true,
                userListDidInvalidate: false
            };
        case actionTypes.USER_ACTIONS.RECEIVE_USERS:
            return {
                ...state,
                userListIsFetching: false,
                userListDidInvalidate: false,
                userListItems: action.users
            };
        default:
            return {
                ...state
            };
    }
}

function rooms(state = {
    roomListIsFetching: false,
    roomListDidInvalidate: false,
    roomListItems: []
}, action) {
    switch (action.type) {
        case actionTypes.ROOM_ACTIONS.INVALIDATE_ROOM_LIST:
            return {
                ...state,
                roomListDidInvalidate: true
            };
        case actionTypes.ROOM_ACTIONS.REQUEST_ROOMS:
            return {
                ...state,
                roomListIsFetching: true,
                roomListDidInvalidate: false
            };
        case actionTypes.ROOM_ACTIONS.RECEIVE_ROOMS:
            return {
                ...state,
                roomListIsFetching: false,
                roomListDidInvalidate: false,
                roomListItems: action.rooms
            };
        default:
            return {
                ...state
            };
    }
}

function messages(state = {
    messageListIsFetching: false,
    messageListDidInvalidate: false,
    messageListItems: []
}, action) {
    switch (action.type) {
        case actionTypes.MESSAGE_ACTIONS.INVALIDATE_MESSAGE_LIST:
            return {
                ...state,
                messageListDidInvalidate: true
            };
        case actionTypes.MESSAGE_ACTIONS.REQUEST_MESSAGES:
            return {
                ...state,
                messageListIsFetching: true,
                messageListDidInvalidate: false
            };
        case actionTypes.MESSAGE_ACTIONS.RECEIVE_MESSAGES:
            return {
                ...state,
                messageListIsFetching: false,
                messageListDidInvalidate: false,
                messageListItems: action.messages
            };
        default:
            return {
                ...state
            };
    }
}

const rootReducer = combineReducers({
    websocket,
    messages,
    rooms,
    users,
    selectedChatRoom
});

export default rootReducer;