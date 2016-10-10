import * as actionTypes from '../constants/actionTypes';
import * as asyncStorageActions from '../actions/asyncStorageActions';
import * as globalConstants from '../constants/globalConstants';

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

        return dispatch(asyncStorageActions.getAsyncValue
        (...getAuthTokenParameters));
    }
}

function processFetchUsersIfNeeded(dispatch, getState) {
    if (shouldFetchUsers(getState())) {
        return dispatch(fetchUsers(this.authToken))
    }
}

function requestUsers(authToken) {
    return {
        type: actionTypes.USER_ACTIONS.REQUEST_USERS,
        authToken
    }
}

function receiveUsers(users) {
    return {
        type: actionTypes.USER_ACTIONS.RECEIVE_USERS,
        users: users
    }
}

function fetchUsers(authToken) {
    return dispatch => {
        dispatch(requestUsers(authToken))
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
    const users = state.users
    if (!users) {
        return true
    } else if (users.userListIsFetching) {
        return false
    } else {
        return users.userListDidInvalidate
    }
}
