const baseurl = '/api/v1'

// Doctors
export const DOCTORS = `${baseurl}/doctors`
export const GET_DOCTORS = `${baseurl}/doctors`
export const UPDATE_DOCTOR = `${baseurl}/doctors`
export const GET_STATES = `${baseurl}/locations/states`
export const GET_CITIES = `${baseurl}/locations/states`

// Patients
export const PATIENTS = `${baseurl}/patients/create`
export const GET_PATIENTS = `${baseurl}/patients`
export const UPDATE_PATIENT = `${baseurl}/patients`
export const GET_PATIENT_BY_ID = `${baseurl}/patients`
export const GET_ALLERGIES = `${baseurl}/allergies`

// Notes
export const NOTES = `${baseurl}/notes`
export const GET_NOTE = `${baseurl}/notes`
export const UPDATE_NOTE = `${baseurl}/notes`
export const GET_NOTE_BY_ID = `${baseurl}/notes`

// Patient Dashboard
export const PATIENT_PROFILE = `${baseurl}/fitbit/profile/:id`
export const PATIENT_ACTIVITY = `${baseurl}/fitbit/activity/:id`
export const PATIENT_SLEEP = `${baseurl}/fitbit/sleep/:id`
export const PATIENT_WATER = `${baseurl}/fitbit/water/:id`
export const PATIENT_HEART = `${baseurl}/fitbit/heart/:id`
export const PATIENT_WEIGHT = `${baseurl}/fitbit/weight/:id`
export const PATIENT_BODY_FAT = `${baseurl}/fitbit/body-fat/:id`
export const PATIENT_FOOD = `${baseurl}/fitbit/food/:id`
export const PATIENT_DEVICES = `${baseurl}/fitbit/devices/:id`
export const PATIENT_GPS_TRACKING = `${baseurl}/fitbit/gps-tracking/:logId`
export const CONNECT_TO_FITBIT = `${baseurl}/fitbit/connect`


