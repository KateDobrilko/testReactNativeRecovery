/**
 * Created by ekaterina.dobrilko on 9/22/2016.
 */
import * as types from '../actions/actionTypes';
import * as actions from '../actions/actions';
import * as websocketEventsConstants from '../constants/websocketEvents';
import * as messageTypeConstants from '../constants/messageTypes';
import {AsyncStorage, ListView} from 'react-native';
var md5 = require('md5');
var PushNotification = require('react-native-push-notification');

PushNotification.configure({
    onNotification: function (notification) {

    }
});

const initState = {
    ws: {},
    rooms: [],
    users: [],
    messages: [],
    currentRoomId: '',
    messagesPage: 0,
    currentUserId: ''
};

export default function RootReducer(state = initState, action = {}) {
    function joinRooms() {
        var data = {
            event: websocketEventsConstants.JOIN_ROOMS,
            userId: null
        };
        AsyncStorage.getItem('X-AUTH-TOKEN').then((authToken) => {
            data['authToken'] = authToken;
            AsyncStorage.getItem('connectionToken').then((connectionToken) => {
                data['connectionToken'] = connectionToken;
                let roomIds = [];
                state.rooms.forEach(room => {
                    roomIds.push(room.id);
                });
                data['roomIds'] = roomIds;
                state.ws.send(JSON.stringify(data));
            });
        });
    }

    switch (action.type) {
        case types.OPEN_CHAT_ROOM:
        {
            return {
                ...state,
                currentRoomId: action.roomId
            };
        }
        case types.CONNECT_WEBSOCKETS:
        {
            state.ws = new WebSocket('ws://chat.exposit-ds.com:80/connection');
            state.ws.onopen = (e) => {
            };
            state.ws.onclose = (e) => {
                console.log(e.code, e.reason);
            };
            state.ws.onmessage = (e) => {
                var data = JSON.parse(e.data);


                switch (data["event"]) {
                    case websocketEventsConstants.JOIN_ROOMS:
                    {

                        var newData = {
                            event: websocketEventsConstants.REQUEST_USERS_ONLINE,
                            userId: data["userId"]
                        };
                        AsyncStorage.getItem('X-AUTH-TOKEN').then((authToken) => {
                            data['authToken'] = authToken;
                            AsyncStorage.getItem('connectionToken').then((connectionToken) => {
                                newData['connectionToken'] = connectionToken;
                                state.ws.send(JSON.stringify(newData));
                            });
                        });
                        break;

                    }

                    case websocketEventsConstants.USER_MESSAGE:
                    {

                        PushNotification.localNotification({
                            vibrate: true, // (optional) default: true
                            vibration: 300,
                            title: "My Notification Title",
                            message: "New Message Income",
                            playSound: true,
                            soundName: 'default',
                            number: '1'
                        });

                        return {
                            ...state,
                            message: state.messages.push.apply(data)
                        }
                    }

                    case websocketEventsConstants.REQUEST_USERS_ONLINE:
                    {
                       
                        break;
                    }

                    case websocketEventsConstants.SOCKET_INIT_MSG :
                    {

                        AsyncStorage.getItem('X-AUTH-TOKEN').then((authToken) => {
                            fetch('http://chat.exposit-ds.com/user/room/all',
                                {
                                    method: 'GET',
                                    headers: {
                                        'X-AUTH-TOKEN': authToken
                                    }
                                }
                            ).then((response) => response.json()).then((responseJson) => {
                                AsyncStorage.setItem("connectionToken", data["connectionToken"]).then(joinRooms());
                                return {
                                    ...state,
                                    rooms: state.rooms.push.apply(state.rooms, responseJson['rooms'])
                                };

                            }).catch((error) => {
                                console.error(error);
                            })
                        });
                        break;
                    }

                }
            };
            state.ws.onerror = (e) => {
                console.log(e.message);
            };
            return {
                ...state
            };
        }
        case types.LOAD_ROOMS:
        {
            AsyncStorage.getItem('X-AUTH-TOKEN').then((authToken) => {
                fetch('http://chat.exposit-ds.com/user/room/all',
                    {
                        method: 'GET',
                        headers: {
                            'X-AUTH-TOKEN': authToken
                        }
                    }
                ).then((response) => response.json()).then((responseJson) => {
                    return {
                        ...state,
                        rooms: state.rooms.push.apply(state.rooms, responseJson['rooms'])
                    };

                }).catch((error) => {
                    console.error(error);
                })
            });
            return {
                ...state
            };
        }
        case types.LOAD_USERS:
        {
            AsyncStorage.getItem('X-AUTH-TOKEN').then((authToken) => {
                fetch('http://chat.exposit-ds.com/account/users',
                    {
                        method: 'GET',
                        headers: {
                            'X-AUTH-TOKEN': authToken
                        }
                    }
                ).then((response) => response.json()).then((responseJson) => {

                    return {
                        ...state,
                        users: state.users.push.apply(state.users, responseJson['employers'])
                    };

                }).catch((error) => {
                    console.error(error);
                })
            });
            return {
                ...state
            };
        }
        case types.LOAD_MESSAGES:
        {
            AsyncStorage.getItem('X-AUTH-TOKEN').then((authToken) => {
                var url = 'http://chat.exposit-ds.com/messages/room/' + state.currentRoomId + '?page=' + state.messagesPage;
                fetch(url,
                    {
                        method: 'GET',
                        headers: {
                            'X-AUTH-TOKEN': authToken
                        }
                    }
                ).then((response) =>
                    response.json()
                ).then((responseJson) => {
                    state.messagesPage = state.messagesPage++;
                    return {
                        ...state,
                        messages: state.messages.push.apply(state.messages, responseJson['messages']),
                        messagesPage: ++state.messagesPage
                    };
                }).catch((error) => {
                    console.error(error);
                })
            });
            return {
                ...state
            };
        }
        case types.LOGIN:
        {
            return {
                ...state
            };
        }

        case types.SEND_MESSAGE:
        {
            var message = {
                content: action.messageText,
                date: '',
                event: websocketEventsConstants.USER_MESSAGE,
                firstName: '',
                hash: md5(action.messageText),
                lastName: '',
                roomId: state.currentRoomId,
                type: messageTypeConstants.TEXT_TYPE
            };

            AsyncStorage.getItem('X-AUTH-TOKEN').then((authToken) => {
                message['authToken'] = authToken;
                AsyncStorage.getItem('connectionToken').then((connectionToken) => {
                    message['connectionToken'] = connectionToken;
                    state.ws.send(JSON.stringify(message));
                });
            });

            return {
                ...state
            };
        }

        default:
            return state;
    }
}