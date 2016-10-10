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
                <Users roomId = {state.currentRoomId}
                       users = {state.users}
                       navigator = {navigator}  {...actions}/>
            );
        }
        if (routeId === 'Rooms') {
            return (
                <Rooms
                    roomId = {state.currentRoomId}
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

export default connect(state => ({
        state: state.RootReducer
    }),
    (dispatch) => ({
        actions: bindActionCreators(actions, dispatch)
    })
)(RootRouter);