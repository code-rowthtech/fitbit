import REPORT_TYPES from "./constant";

export const getAllReports = (data) => ({
    type: REPORT_TYPES.GET_ALL_REPORTS,
    payload: data
})

export const getReportById = (data) => ({
    type: REPORT_TYPES.GET_REPORT_BY_ID,
    payload: data
})

export const createReport = (data) => ({
    type: REPORT_TYPES.CREATE_REPORT,
    payload: data
})

export const updateReport = (data) => ({
    type: REPORT_TYPES.UPDATE_REPORT,
    payload: data
})

export const resetCreateReport = () => ({
    type: REPORT_TYPES.CREATE_REPORT_RESET
})

export const resetUpdateReport = () => ({
    type: REPORT_TYPES.UPDATE_REPORT_RESET
})
