import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getPatientProfileApi(data) {
    return api.get(URL.PATIENT_PROFILE.replace(':id', data.payload.id));
}

export function getPatientActivityApi(data) {
    return api.get(URL.PATIENT_ACTIVITY.replace(':id', data.payload.id));
}

export function getPatientSleepApi(data) {
    return api.get(URL.PATIENT_SLEEP.replace(':id', data.payload.id));
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
    return api.get(`${URL.CONNECT_TO_FITBIT}/${data.payload.patientId}`, data.payload.body)

}

