import React, {Component, PropTypes} from 'react';
import {
    View,
    Navigator,
    Text,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    AsyncStorage,
    ListView,
    ScrollView,
    StyleSheet,
    InteractionManager
} from 'react-native';
var gravatarApi = require('gravatar-api');

var rooms = [];
export default class Rooms extends Component {
    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            roomsDataSource: ds.cloneWithRows(rooms),
            renderPlaceholderOnly: true
        }
    }

    componentDidMount() {
        console.log(this.props.connectWebsockets);
        this.props.connectWebsockets();
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
    }

    componentWillReceiveProps(nextProps) {
        this.props.fetchRoomsIfNeeded();
        this.setState({
            roomsDataSource: this.state.roomsDataSource.cloneWithRows(nextProps.rooms)
        });
    }

    navMessages(roomId) {
        this.props.navigator.push({
            id: 'Messages',
            data: {
                roomId: roomId
            }
        });
    }

    logOut() {
        AsyncStorage.removeItem('X-AUTH-TOKEN');
        this.props.navigator.push(
            {
                id: "Login"
            }
        )
    }

    navUsers() {
        this.props.navigator.push({
            id: 'Users'
        });
    }

    _renderRow(rowData) {
        return (<TouchableOpacity onPress = {() => {
                        this.props.selectRoom(rowData);
                        this.navMessages();}}
                                  style = {[styles.listRow]}>
            <View style = {{flex: 1, justifyContent: 'center', paddingLeft: 10, paddingRight: 10}}>
                <Text ellipsizeMode = "tail"
                      style = {{flex:1, justifyContent: 'center', fontSize:18}}>{rowData.name}</Text>
            </View>
        </TouchableOpacity> )
    }

    _renderPlaceholderView() {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }

    render() {
        return (
            <View>
                <TouchableHighlight underlayColor = "black" style = {[styles.logOutButton]}
                                    onPress = {this.logOut.bind(this)}>
                    <Text style = {[styles.goNextButtonText]}>Log Out</Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor = "#56a570" style = {[styles.goNextButton]}
                                    onPress = {this.navUsers.bind(this)}>
                    <Text style = {[styles.goNextButtonText]}>Go To Users ></Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor = "#56a570" style = {[styles.signInButton]}
                                    onPress = {()=>
                                    {
                                        this.props.invalidateRoomList();
                                        this.props.fetchRoomsIfNeeded();
                                    }}>
                    <Text style = {[styles.signInButtonText]}>LOAD ROOMS</Text>
                </TouchableHighlight>
                <ScrollView>
                    <ListView style = {{flex: 1, height: 470, flexDirection: 'row'}}
                              dataSource = {this.state.roomsDataSource}
                              renderRow = {this._renderRow.bind(this)}/>
                </ScrollView>
            </View>
        )

    }
}
const styles = StyleSheet.create({
    roundedProfileImage: {
        justifyContent: 'flex-start',
        width: 100,
        height: 100,
        borderWidth: 3,
        borderColor: 'white',
        borderRadius: 50
    },
    signInButton: {
        backgroundColor: '#5fba7d',
        padding: 10
    },
    signInButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    goNextButton: {
        backgroundColor: '#ffd47c',
        padding: 10
    },
    logOutButton: {
        backgroundColor: '#111',
        padding: 10
    },
    goNextButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    listRow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: 50,
        borderBottomColor: '#ededed',
        borderBottomWidth: 1,
        padding: 10
    }
});