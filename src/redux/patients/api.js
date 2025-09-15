import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getAllPatientsApi(data) {
    const url = data?.payload?.doctorId 
        ? `${URL.GET_PATIENTS}?doctorId=${data.payload.doctorId}`
        : URL.GET_PATIENTS;
    return api.get(url);
}

export function getPatientByIdApi(data) {
    return api.get(`${URL.GET_PATIENT_BY_ID}/${data.payload}`)
}

export function createPatientApi(data) {
    return api.create(URL.PATIENTS, data.payload)
}

export function updatePatientApi(data) {
    return api.update(`${URL.UPDATE_PATIENT}/${data.payload.patientId}`, data.payload.body)
}

export function getAllergiesApi() {
    return api.get(URL.GET_ALLERGIES)
}

