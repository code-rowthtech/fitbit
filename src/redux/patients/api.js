import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getAllPatientsApi(data) {
    const params = new URLSearchParams();
    
    if (data?.payload?.doctorId) {
        params.append('doctorId', data.payload.doctorId);
    }
    if (data?.payload?.page) {
        params.append('page', data.payload.page);
    }
    if (data?.payload?.limit) {
        params.append('limit', data.payload.limit);
    }
    if (data?.payload?.search) {
        params.append('search', data.payload.search);
    }
    if (data?.payload?.startDateRange) {
        params.append('startDateRange', data.payload.startDateRange);
    }
    if (data?.payload?.endDateRange) {
        params.append('endDateRange', data.payload.endDateRange);
    }
    if (data?.payload?.paginate !== undefined) {
        params.append('paginate', data.payload.paginate);
    }
    if (data?.payload?.isActive !== undefined) {
        params.append('isActive', data.payload.isActive);
    }
    if (data?.payload?.patientType) {
        params.append('patientType', data.payload.patientType);
    }
    
    const url = params.toString() ? `${URL.GET_PATIENTS}?${params.toString()}` : URL.GET_PATIENTS;
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

export function createAllergiesApi(data) {
    return api.create(URL.CREATE_ALLERGIES, data.payload)
}

