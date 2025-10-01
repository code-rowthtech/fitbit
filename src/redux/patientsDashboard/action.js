import PATIENT_DASHBOARD_TYPES from "./constant";

export const getPatientProfile = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE,
    payload: data
})

export const getPatientActivity = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVITY,
    payload: data
})

export const getPatientSleep = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP,
    payload: data
})

export const getPatientCaloriesBurned = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_CALORIES_BURNED,
    payload: data
})

export const getPatientDistance = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_DISTANCE,
    payload: data
})

export const getPatientSleepEfficiency = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_EFFICIENCY,
    payload: data
})

export const getPatientWater = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_WATER,
    payload: data
})

export const getPatientHeart = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART,
    payload: data
})

export const getPatientWeight = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_WEIGHT,
    payload: data
})

export const getPatientBodyFat = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_BODY_FAT,
    payload: data
})

export const getPatientFood = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_FOOD,
    payload: data
})

export const getPatientDevices = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_DEVICES,
    payload: data
})

export const getPatientGpsTracking = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_GPS_TRACKING,
    payload: data
})

export const connectToFitbit = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.CONNECT_TO_FITBIT,
    payload: data
})

export const getPatientActiveMin = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVE_MIN,
    payload: data
})

export const getPatientHeartRate = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_RATE,
    payload: data
})

export const getFilterData = (data) => ({
    type: PATIENT_DASHBOARD_TYPES.GET_FILTER_DATA,
    payload: data
})


