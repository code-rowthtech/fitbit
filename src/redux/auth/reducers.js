import { AuthActionTypes } from './constants';
import { APICore } from '../../helpers/api/apiCore';

const api = new APICore();

// Check localStorage for user data on initialization
const getInitialUser = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        try {
            return JSON.parse(user);
        } catch (e) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return null;
        }
    }
    return api.getLoggedInUser();
};

const initialUser = getInitialUser();

const INIT_STATE = {
    user: initialUser,
    userLoggedIn: !!initialUser,
    loading: false,
};

const Auth = (state = INIT_STATE, action) => {
    switch (action.type) {
        case AuthActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case AuthActionTypes.LOGIN_USER: {
                    return {
                        ...state,
                        user: action.payload.data,
                        userLoggedIn: true,
                        loading: false,
                    };
                }
                case AuthActionTypes.SIGNUP_USER: {
                    return {
                        ...state,
                        loading: false,
                        userSignUp: true,
                    };
                }
                case AuthActionTypes.LOGOUT_USER: {
                    return {
                        ...state,
                        user: null,
                        loading: false,
                        userLogout: true,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD: {
                    return {
                        ...state,
                        resetPasswordSuccess: action.payload.data,
                        loading: false,
                        passwordReset: true,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD_CHANGE: {
                    return {
                        ...state,
                        loading: false,
                        passwordChange: true,
                    };
                }
                default:
                    return { ...state };
            }

        case AuthActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case AuthActionTypes.LOGIN_USER: {
                    console.log('Login error:', action.payload.error);
                    return {
                        ...state,
                        error: action.payload.error,
                        userLoggedIn: false,
                        loading: false,
                    };
                }
                case AuthActionTypes.SIGNUP_USER: {
                    return {
                        ...state,
                        registerError: action.payload.error,
                        userSignUp: false,
                        loading: false,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD: {
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                        passwordReset: false,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD_CHANGE: {
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                        passwordChange: false,
                    };
                }
                default:
                    return { ...state };
            }

        case AuthActionTypes.LOGIN_USER:
            return { ...state, loading: true, userLoggedIn: false };
        case AuthActionTypes.LOGOUT_USER:
            return { ...state, loading: true, userLogout: false };
        case AuthActionTypes.SIGNUP_USER:
            return { ...state, loading: true, userSignUp: false };
        case AuthActionTypes.FORGOT_PASSWORD:
            return { ...state, loading: true, passwordReset: false };
        case AuthActionTypes.FORGOT_PASSWORD_CHANGE:
            return { ...state, loading: true, passwordChange: false };
        case AuthActionTypes.RESET:
            return {
                ...state,
                loading: false,
                error: false,
                userSignUp: false,
                userLoggedIn: false,
                passwordReset: false,
                passwordChange: false,
                resetPasswordSuccess: null,
            };
        default:
            return { ...state };
    }
};

export default Auth;
