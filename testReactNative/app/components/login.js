import React, {Component, PropTypes} from 'react';
import {
    View,
    Navigator,
    Text,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    AsyncStorage
} from 'react-native';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state =
        {
            login: "",
            password: ""
        }
    }

    render() {
        return (
            <View style = {[styles.container]}>
                <Text style = {[styles.labelText]}>Login:</Text>
                <View style = {[styles.textInputWrapper]}>
                    <TextInput style = {[styles.textInput]}
                               onChangeText = {(login) => this.setState({login})}></TextInput>
                </View>
                <Text style = {[styles.labelText]}>Password:</Text>
                <View style = {[styles.textInputWrapper]}>
                    <TextInput style = {[styles.textInput]} secureTextEntry = {true}

                               onChangeText = {(password) => this.setState({password})}></TextInput>
                </View>
                <TouchableHighlight underlayColor="#b2e3f7" style = {[styles.signInButton]}
                                    onPress = {this.login.bind(this)}>
                    <Text style = {[styles.signInButtonText]}>Sign In</Text>
                </TouchableHighlight>
            </View>
        );
    }

    goToUsers() {
        this.props.navigator.push({
            id: 'Users'
        });
    }

    login() {
        return fetch('http://chat.exposit-ds.com/sign-in', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: this.state["login"],
                password: this.state["password"]
            })
        }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson);
            if (this.validateToken(responseJson['X-AUTH-TOKEN'])) {
                AsyncStorage.setItem('X-AUTH-TOKEN', responseJson['X-AUTH-TOKEN']).then(this.goToUsers.bind(this));
            } else {
                console.log('TokenError');
            }
        })
            .catch((error) => {
                console.error(error);
            });
    }

    logOut() {
        AsyncStorage.removeItem('X-AUTH-TOKEN');
    }

    isUserAuthorized() {
        return AsyncStorage.getItem('X-AUTH-TOKEN') ? true : false;
    }

    validateToken(token) {
        console.log((typeof token) == "string");
        console.log(token.length > 10);
        return (((typeof token) == "string") && (token.length > 10));
    }


}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#00d8ff',
        flex: 1
    },
    textInput: {
        color: 'white',
        fontSize: 16,
        paddingBottom: 5,
        bottom: 5

    },
    textInputWrapper: {
        margin: 20,
        height: 40,
        borderBottomColor: 'white',
        borderBottomWidth: 2,
        borderStyle: 'solid'

    },
    labelText: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        height: 40,
        color: 'white'
    },
    signInButton: {
        margin: 20,
        backgroundColor: 'white',
        color: '#00d8ff'
    },
    signInButtonText: {
        color: '#00d8ff',
        fontSize: 20,
        padding: 10,
        textAlign: 'center'
    }
});