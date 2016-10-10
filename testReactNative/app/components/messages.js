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
    TextInput,
    InteractionManager
} from 'react-native';


var messages = [];

export default class Messages extends Component {
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            messagesDataSource: ds.cloneWithRows(messages),
            messageText: '',
            renderPlaceholderOnly: true

        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({renderPlaceholderOnly: false});
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            messagesDataSource: this.state.messagesDataSource.cloneWithRows(nextProps.messages)
        });
    }

    navUsers() {
        this.props.navigator.push(
            {
                id: "Users"
            }
        )
    }

    logOut() {
        AsyncStorage.removeItem('X-AUTH-TOKEN');
        this.props.navigator.push(
            {
                id: "Login"
            }
        )
    }

    _renderRow(rowData) {
        var date = new Date(rowData.date);
        return (
            <View
                style = {{flexDirection:'row', flex:1,alignItems: 'flex-start', flexWrap: 'wrap', borderBottomColor: '#ededed', borderBottomWidth:1, paddingLeft:10, paddingTop:10}}>
                <View
                    style = {{justifyContent: 'center', minHeight: 100, flex:1, paddingLeft: 20,  paddingRight: 20, alignItems: 'flex-start', flexWrap: 'wrap'}}>
                    <Text style = {{ flex:1, fontSize:22}}>{date.toDateString()}</Text>
                    <Text style = {{ flex:1, color: '#666',  flexWrap: 'wrap'}}>{rowData.content}</Text>
                </View>
            </View> )
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
                    <Text style = {[styles.goNextButtonText]}>Go Back To Users ></Text>
                </TouchableHighlight>
                <TouchableHighlight underlayColor = "#56a570" style = {[styles.signInButton]}
                                    onPress = {this.props.loadMessages}>
                    <Text style = {[styles.signInButtonText]}>LOAD MESSAGES</Text>
                </TouchableHighlight>
                <Text style = {[styles.labelText]}>Message input:</Text>
                <View style = {[styles.textInputWrapper]}>
                    <TextInput style = {[styles.textInput]}
                               onChangeText = {(messageText) => this.setState({messageText})}></TextInput>
                </View>
                <TouchableHighlight underlayColor = "#b2e3f7" style = {[styles.signInButton]}
                                    onPress = {() => {this.props.sendMessage(this.state.messageText);}}>
                    <Text style = {[styles.signInButtonText]}>Send Message</Text>
                </TouchableHighlight>
                <ScrollView>
                    <ListView style = {{flex: 1, height: 350}}
                              dataSource = {this.state.messagesDataSource}
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
    logOutButton: {
        backgroundColor: '#111',
        padding: 10
    },
    goNextButton: {
        backgroundColor: '#ffd47c',
        padding: 10
    },
    goNextButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    }
});