import React, {Component, PropTypes} from 'react';
import {View, Navigator, TouchableHighlight, Text, AsyncStorage} from 'react-native';

import Login from '../login';
import Messages from '../messages';
import Users from '../users';
import Rooms from '../rooms';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as actions from '../../actions/actions';

class RootRouter extends Component {
    render() {
        return (
            <Navigator
                initialRoute = {this.getInitialRoute()}
                renderScene = {this.renderScene.bind(this)}/>
        );
    }

    getInitialRoute() {
        if (this.isAuthorized()) {
            return {id: 'Login'};
        }
        else {
            return {id: 'Users'}
        }
    }


    isAuthorized() {
        return AsyncStorage.getItem('X-AUTH-TOKEN') ? true : false;

    }

    renderScene(route, navigator) {
        const {state, actions} = this.props;
        console.log(state);
        var routeId = route.id;
        if (routeId === 'Login') {
            return (
                <Login {...state}
                    navigator = {navigator}  {...actions}/>
            );
        }
        if (routeId === 'Users') {
            console.log(state);
            return (
                <Users roomId = {state.selectedChatRoom}
                       users = {state.users}
                       navigator = {navigator}  {...actions}/>
            );
        }
        if (routeId === 'Rooms') {
            return (
                <Rooms
                    roomId = {state.selectedChatRoom}
                    rooms = {state.rooms}
                    navigator = {navigator}  {...actions} />
            );
        }
        if (routeId === 'Messages') {
            return (
                <Messages messages = {state.messages}
                          navigator = {navigator}  {...actions} />
            );
        }
    }
}

function mapStateToProps(state) {
    console.log(state);
    const {selectedChatRoom} = state;

    const {
        userListIsFetching,
        userListDidInvalidate,
        userListItems

    } = state.users;
    const {
        messageListIsFetching,
        messageListDidInvalidate,
        messageListItems

    } = state.messages;

    const {
        roomListIsFetching,
        roomListDidInvalidate,
        roomListItems

    } = state.rooms;



    return {
        selectedChatRoom,
        userListIsFetching,
        userListDidInvalidate,
        userListItems,
        messageListIsFetching,
        messageListDidInvalidate,
        messageListItems,
        roomListIsFetching,
        roomListDidInvalidate,
        roomListItems
    };
}

export default connect(state => mapStateToProps(state),
    (dispatch) => ({
        actions: bindActionCreators(actions, dispatch)
    })
)(RootRouter);