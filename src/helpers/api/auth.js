import { APICore } from './apiCore';

const api = new APICore();

const baseurl = 'api/v1'

function login(params) {
    return api.create(`${baseurl}/auth/login`, params);
}

function logout() {
    const baseUrl = '/auth/logout/';
    return api.create(`${baseUrl}`, {});
}

function signup(params) {
    const baseUrl = '/register/';
    return api.create(`${baseUrl}`, params);
}

function forgotPassword(params) {
    const baseUrl = `${baseurl}/doctors/forgot-password`;
    return api.create(`${baseUrl}`, params);
}

function forgotPasswordConfirm(params) {
    const baseUrl = `${baseurl}/doctors/reset-password`;
    return api.create(`${baseUrl}`, params);
}

function verifyOtpPassword(params) {
    const baseUrl = `${baseurl}/doctors/verify-otp-password`;
    return api.create(`${baseUrl}`, params);
}

export { login, logout, signup, forgotPassword, forgotPasswordConfirm, verifyOtpPassword };