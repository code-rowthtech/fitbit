import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getAllDoctorsApi(data) {
    const params = new URLSearchParams();
    // if (data.payload.status && data.payload.status !== 'all') params.append('status', data.payload.status);
    // if (data.payload.specialty && data.payload.specialty !== 'all') params.append('specialty', data.payload.specialty);
    // if (data.payload.department && data.payload.department !== 'all') params.append('department', data.payload.department);
    // if (data.payload.page) params.append('page', data.payload.page);
    // if (data.payload.limit) params.append('limit', data.payload.limit);
    // if (data.payload.user) params.append('user', data.payload.user);

    return api.get(`${URL.GET_DOCTORS}?${params.toString()}`);
}

export function createDoctorApi(data) {
    return api.create(URL.DOCTORS, data.payload)
}

export function updateDoctorApi(data) {
    return api.update(`${URL.UPDATE_DOCTOR}/${data.payload.doctorId}`, data.payload.body)
}

export function getStatesApi() {
    return api.get(URL.GET_STATES)
}

export function getCitiesApi(data) {
    return api.get(`${URL.GET_CITIES}/${data?.stateCode?.value}/cities`)
}

