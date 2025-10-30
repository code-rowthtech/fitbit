import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function addNotesApi(data) {
    return api.create(URL.ADD_NOTES, data.payload)
}

export function getNotesApi(data) {
    const params = new URLSearchParams();
    
    if (data?.payload?.page) {
        params.append('page', data.payload.page);
    }
    if (data?.payload?.limit) {
        params.append('limit', data.payload.limit);
    }
    
    const baseUrl = `${URL.GET_NOTES}/${data.payload.patientId}`;
    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    return api.get(url);
}

export function updateNotesApi(data) {
    return api.update(`${URL.UPDATE_NOTES}/${data.payload.noteId}`, data.payload.body)
}

export function deleteNotesApi(data) {
    return api.delete(`${URL.DELETE_NOTES}/${data.payload}`)
}

export function getAlertsApi(data) {
    const params = new URLSearchParams();
    
    if (data?.payload?.page) {
        params.append('page', data.payload.page);
    }
    if (data?.payload?.limit) {
        params.append('limit', data.payload.limit);
    }
    if (data?.payload?.startDate) {
        params.append('startDate', data.payload.startDate);
    }
    if (data?.payload?.endDate) {
        params.append('endDate', data.payload.endDate);
    }
    if (data?.payload?.severity) {
        params.append('severity', data.payload.severity);
    }
    
    const baseUrl = `${URL.GET_ALERTS}/${data.payload.patientId}`;
    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    return api.get(url);
}