const baseurl = "/api/v1";

// Doctors
export const DOCTORS = `${baseurl}/doctors`;
export const GET_DOCTORS = `${baseurl}/doctors`;
export const GET_SINGLE_DOCTOR = `${baseurl}/doctors/me`;
export const UPDATE_DOCTOR = `${baseurl}/doctors`;
export const GET_STATES = `${baseurl}/locations/states`;
export const GET_CITIES = `${baseurl}/locations/states`;
export const GET_SKILLS = `${baseurl}/skills`;
export const CREATE_SKILLS = `${baseurl}/skills`;
export const GET_CATEGORY = `${baseurl}/skills`;
export const GET_SPECIALIZATIONS = `${baseurl}/specializations`;
export const CREATE_SPECIALIZATIONS = `${baseurl}/specializations/create`;
export const GET_SPECIALIZATIONS_CATEGORY = `${baseurl}/specializations`;
export const CREATE_DEGREE = `${baseurl}/qualifications/add`;
export const GET_QUALIFICATION = `${baseurl}/qualifications`;

// Patients
export const PATIENTS = `${baseurl}/patients/create`;
export const GET_PATIENTS = `${baseurl}/patients`;
export const UPDATE_PATIENT = `${baseurl}/patients`;
export const GET_PATIENT_BY_ID = `${baseurl}/patients`;
export const GET_ALLERGIES = `${baseurl}/allergies`;
export const CREATE_ALLERGIES = `${baseurl}/allergies/add`;

// Reports
export const REPORTS = `${baseurl}/reports/ranges`;
export const GET_REPORTS = `${baseurl}/reports/patient`;
export const GET_REPORT = `${baseurl}/reports`;
export const UPDATE_REPORT = `${baseurl}/reports`;
export const GET_REPORT_BY_ID = `${baseurl}/reports`;
export const DOWNLOAD_REPORT = `${baseurl}/reports/patient`;
export const GET_YEARLY_REPORTS = `${baseurl}/reports/patient`;
export const DOWNLOAD_YEARLY_REPORT = `${baseurl}/reports/patient`;

// Patient Dashboard
export const PATIENT_PROFILE = `${baseurl}/fitbit/profile`;
export const PATIENT_ACTIVITY = `${baseurl}/fitbit/activity`;
export const PATIENT_SLEEP = `${baseurl}/fitbit/filter`;
export const PATIENT_SLEEP_STAGES = `${baseurl}/fitbit/filter`;
export const PATIENT_SLEEP_EFFICIENCY = `${baseurl}/fitbit/filter`;
export const PATIENT_CALORIES_BURNED = `${baseurl}/fitbit/filter`;
export const PATIENT_DISTANCE = `${baseurl}/fitbit/filter`;
export const PATIENT_ACTIVE_MIN = `${baseurl}/fitbit/filter`;
export const PATIENT_HEART_RATE = `${baseurl}/fitbit/filter`;
export const PATIENT_WATER = `${baseurl}/fitbit/filter`;
export const CALORIES_CONSUMED = `${baseurl}/fitbit/filter`;
export const PATIENT_HEART = `${baseurl}/fitbit/heart`;
export const PATIENT_WEIGHT = `${baseurl}/fitbit/filter`;
export const PATIENT_BODY_FAT = `${baseurl}/fitbit/body-fat`;
export const PATIENT_FOOD = `${baseurl}/fitbit/food`;
export const PATIENT_DEVICES = `${baseurl}/fitbit/devices`;
export const PATIENT_GPS_TRACKING = `${baseurl}/fitbit/gps-tracking/:logId`;
export const CONNECT_TO_FITBIT = `${baseurl}/fitbit/connect`;
export const GET_FILTER_DATA = `${baseurl}/fitbit/filter`;
export const GET_EXERCISE_SESSIONS = `${baseurl}/fitbit/filter`;

// Notes
export const ADD_NOTES = `${baseurl}/notes/create`;
export const GET_NOTES = `${baseurl}/notes/patient`;
export const UPDATE_NOTES = `${baseurl}/notes`;
export const DELETE_NOTES = `${baseurl}/notes`;
export const GET_ALERTS = `${baseurl}/alerts/patient`;

