import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getPatientProfileApi(data) {
    return api.get(`${URL.PATIENT_PROFILE}/${data.payload.id}`)
}

export function getPatientActivityApi(data) {
    return api.get(`${URL.PATIENT_ACTIVITY}/${data.payload.id}`)
}

export function getPatientSleepApi(data) {
    const baseUrl = `${URL.PATIENT_SLEEP}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
    const url = data.payload.period ? `${baseUrl}&period=${data.payload.period}` : baseUrl;
    return api.get(url);
}

export function getPatientSleepEfficiencyApi(data) {
    const baseUrl = `${URL.PATIENT_SLEEP_EFFICIENCY}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
    const url = data.payload.period ? `${baseUrl}&period=${data.payload.period}` : baseUrl;
    return api.get(url);
}

export function getPatientWaterApi(data) {
    return api.get(URL.PATIENT_WATER.replace(':id', data.payload.id));
}

export function getPatientHeartApi(data) {
    return api.get(URL.PATIENT_HEART.replace(':id', data.payload.id));
}

export function getPatientWeightApi(data) {
    return api.get(URL.PATIENT_WEIGHT.replace(':id', data.payload.id));
}

export function getPatientBodyFatApi(data) {
    return api.get(URL.PATIENT_BODY_FAT.replace(':id', data.payload.id));
}

export function getPatientFoodApi(data) {
    return api.get(URL.PATIENT_FOOD.replace(':id', data.payload.id));
}

export function getPatientDevicesApi(data) {
    return api.get(URL.PATIENT_DEVICES.replace(':id', data.payload.id));
}

export function getPatientGpsTrackingApi(data) {
    return api.get(URL.PATIENT_GPS_TRACKING.replace(':logId', data.payload.logId));
}

export function connectToFitbitApi(data) {
    return api.get(`${URL.CONNECT_TO_FITBIT}/${data.payload.patientId}`, data.payload.body);
}

export function getFilterDataApi(data) {
    const baseUrl = `${URL.GET_FILTER_DATA}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
    const url = data.payload.period ? `${baseUrl}&period=${data.payload.period}` : baseUrl;
    return api.get(url);
}

