import axios from 'axios'

import { SIGN_UP_URL, SIGN_IN_URL, RESET_PASSWORD_URL, REFRESH_TOKEN_URL, CHANGE_PASSWORD_URL } from '../consts/firebase'
import { circuralProgress } from "./fullScreenCircuralProgress"
import { addSnackbar } from "./snackbars"

const SAVE_USER = 'auth/SAVE_USER'
const LOG_OUT = 'auth/LOG_OUT'

const getSnackbarText = (string) => {
    switch (string) {
        case 'EMAIL_EXISTS':
            return 'Ten email jest już użyty'
        case 'OPERATION_NOT_ALLOWED':
            return 'Wprowadzone dane są niepoprawne'
        case 'EMAIL_NOT_FOUND':
            return 'Wprowadzone dane są niepoprawne'
        case 'INVALID_PASSWORD':
            return 'Wprowadzone dane są niepoprawne'
        case 'USER_DISABLED':
            return 'Wprowadzone dane są niepoprawne'
        default:
            return 'Coś poszło nie tak. Spróbuj później'
    }
}

export const authRequest = (url, method = 'get', data = {}) => (dispatch, getState) => {

    const getUrlWithToken = () => {
        const idToken = getState().auth.idToken
        if (idToken) {
            return url.includes('?') ? url + '&auth=' + idToken : url + '?auth=' + idToken
        }
        return url
    }
    return axios({
        url: getUrlWithToken(),
        method,
        data
    })
        .catch(error => {
            const refreshToken = localStorage.getItem('refreshToken')
            if (refreshToken && error.response.statusText === 'Unauthorized')
                return dispatch(useRefreshTokenAsyncActionCreator(refreshToken))
                    .then(() => {
                        return axios({
                            url: getUrlWithToken(),
                            method,
                            data
                        })
                    })
                    .catch((error) => {
                        dispatch(logoutActionCreator())
                        dispatch(addSnackbar('Twoja sesja wygasła', 'red'))
                        return Promise.reject(error)
                    })
            else {
                return Promise.reject(error)
            }
        })
}

export const registerAsyncActionCreator = (email, password) => (dispatch, getState) => {
    dispatch(circuralProgress.add())
    axios.post(SIGN_UP_URL, {
        email,
        password
    })
        .then(response => {
            const { idToken, refreshToken, localId } = response.data
            dispatch(saveUserActionCreator(idToken, refreshToken, localId, email))
        })
        .catch(error => {
            const text = getSnackbarText(
                error.response.data &&
                error.response.data.error &&
                error.response.data.error.message)
            dispatch(addSnackbar(text, 'red'))
        })
        .finally(() => dispatch(circuralProgress.remove()))
}

export const loginAsyncAction = (email, password) => (dispatch, getState) => {
    dispatch(circuralProgress.add());
    axios.post(SIGN_IN_URL, {
        email,
        password,
        returnSecureToken: true
    })
        .then(response => {
            const { idToken, refreshToken, localId } = response.data
            dispatch(saveUserActionCreator(idToken, refreshToken, localId, email))
        })
        .catch(error => {
            const text = getSnackbarText(
                error.response.data &&
                error.response.data.error &&
                error.response.data.error.message
            )
            dispatch(addSnackbar(text, 'red'))
        })
        .finally(() => dispatch(circuralProgress.remove()))
}

export const resetPasswordAsyncAction = (email, success) => (dispatch) => {
    dispatch(circuralProgress.add())
    axios.post(RESET_PASSWORD_URL, {
        email,
        requestType: 'PASSWORD_RESET'
    })
        .then(() => {
            dispatch(addSnackbar('Wiadomość została wysłana na maila', 'green'))
            success()
        })
        .catch(() => {
            dispatch(addSnackbar('Wprowadzone dane są niepoprawne', 'red'))
        })
        .finally(() => dispatch(circuralProgress.remove()))
}

export const changePasswordAsyncActionCreator = (oldPassword, newPassword) => (dispatch, getState) => {
    const authState = getState().auth
    const email = authState.email;
    const idToken = authState.idToken

    dispatch(circuralProgress.add())
    return axios({
        method: 'post',
        url: SIGN_IN_URL,
        data: {
            email,
            password: oldPassword
        }
    })
        .then(() => {
            return axios({
                method: 'post',
                url: CHANGE_PASSWORD_URL,
                data: {
                    idToken,
                    password: newPassword,
                    returnSecureToken: true
                }
            })
        })
        .then(r => {
            dispatch(saveUserActionCreator(r.data.idToken, r.data.refreshToken))
            dispatch(addSnackbar('Hasło zostało zmienione.'))
            return r
        })
        .catch((r) => {
            let message = 'Błąd! Spróbuj ponownie.'
            if (r.response && r.response.data.error && r.response.data.error.message === 'INVALID_PASSWORD')
                message = 'Nieprawidłowe obecne hasło.'
            if (r.response && r.response.data.error && r.response.data.error.message === 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN')
                message = 'Musisz się zalogować, aby ponownie zmienić hasło.'
            dispatch(addSnackbar(message, 'red'))
            return r
        })
        .finally(() => dispatch(circuralProgress.remove()))
}

export const logoutActionCreator = () => {
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('email');
    return {
        type: LOG_OUT
    }
}

const saveUserActionCreator = (idToken, refreshToken, userId, email) => {
    localStorage.setItem('refreshToken', refreshToken)
    if (email) {
        localStorage.setItem('email', email);
    }
    return {
        type: SAVE_USER,
        idToken,
        userId,
        email,
    }
}


export const autoLoginAsyncActionCreator = () => (dispatch, getState) => {
    const refreshToken = localStorage.getItem('refreshToken')
    if (refreshToken) {
        dispatch(useRefreshTokenAsyncActionCreator(refreshToken))
    }
}

const useRefreshTokenAsyncActionCreator = refreshToken => (dispatch, getState) => {
    dispatch(circuralProgress.add())
    const email = localStorage.getItem('email');
    return axios.post(REFRESH_TOKEN_URL, {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    })
        .then(response => {
            const { id_token, refresh_token, user_id } = response.data
            dispatch(saveUserActionCreator(id_token, refresh_token, user_id, email))
            return response
        })
        .finally(() => dispatch(circuralProgress.remove()))
}

const initialState = {
    isLogged: false,
    idToken: null,
    userId: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SAVE_USER:
            return {
                ...state,
                isLogged: true,
                idToken: action.idToken,
                userId: action.userId,
                email: action.email,
            }
        case LOG_OUT:
            return {
                ...state,
                isLogged: false,
                idToken: null,
                userId: null,
                email: null,
            }
        default:
            return state
    }
}