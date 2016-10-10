import * as types from './actionTypes';


export function openChatRoom(roomId) {
    return {
        type: types.OPEN_CHAT_ROOM,
        roomId: roomId
    };
}

export function connectWebsockets() {
    return {
        type: types.CONNECT_WEBSOCKETS
    };
}

export function loadRooms() {
    return {
        type: types.LOAD_ROOMS
    };
}

export function loadUsers() {
    return {
        type: types.LOAD_USERS
    };
}

export function loadMessages() {
    return {
        type: types.LOAD_MESSAGES
    };
}

export function login() {
    return {
        type: types.LOGIN
    };
}

export function sendMessage(messageText) {
    return {
        type: types.SEND_MESSAGE,
        messageText: messageText
    }
}