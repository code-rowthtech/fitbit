import * as URL from "../../constants/endpoint"
import { APICore } from "../../helpers/api/apiCore"
const api = new APICore()

export function getAllReportsApi(data) {
    return api.get(`${URL.GET_REPORTS}/${data.payload.id}/monthly/${data.payload.month}`);
}

export function getReportByIdApi(data) {
    return api.get(`${URL.GET_REPORT}/${data.payload.reportId}`);
}

export function createReportApi(data) {
    return api.create(URL.REPORTS, data.payload)
}

export function updateReportApi(data) {
    return api.update(`${URL.UPDATE_REPORT}/${data.payload.reportId}`, data.payload.body)
}

export function downloadReportApi(data) {
    return api.getFile(`${URL.DOWNLOAD_REPORT}/${data.payload.id}/monthly/${data.payload.month}/csv`);
}