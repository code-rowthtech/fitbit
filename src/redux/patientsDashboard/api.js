import * as URL from "../../constants/endpoint";
import { APICore } from "../../helpers/api/apiCore";
import axios from "axios";
const api = new APICore();

export function getPatientProfileApi(data) {
  return api.get(`${URL.PATIENT_PROFILE}/${data.payload.id}`);
}

export function getPatientActivityApi(data) {
  return api.get(`${URL.PATIENT_ACTIVITY}/${data.payload.id}`);
}

export function getPatientSleepApi(data) {
  const baseUrl = `${URL.PATIENT_SLEEP}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getPatientCaloriesBurnedApi(data) {
  const baseUrl = `${URL.PATIENT_CALORIES_BURNED}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getPatientDistanceApi(data) {
  const baseUrl = `${URL.PATIENT_DISTANCE}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getPatientSleepEfficiencyApi(data) {
  const baseUrl = `${URL.PATIENT_SLEEP_EFFICIENCY}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getPatientWaterApi(data) {
  const baseUrl = `${URL.PATIENT_WATER}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getPatientHeartApi(data) {
  const baseUrl = `${URL.PATIENT_HEART}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getPatientWeightApi(data) {
  const baseUrl = `${URL.PATIENT_WEIGHT}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getPatientBodyFatApi(data) {
  return api.get(URL.PATIENT_BODY_FAT.replace(":id", data.payload.id));
}

export function getPatientFoodApi(data) {
  return api.get(URL.PATIENT_FOOD.replace(":id", data.payload.id));
}

export function getPatientDevicesApi(data) {
  return api.get(URL.PATIENT_DEVICES.replace(":id", data.payload.id));
}

export function getPatientGpsTrackingApi(data) {
  const url = `${URL.PATIENT_GPS_TRACKING}/${data.payload.logId}?userId=${data.payload.userId}`;
  return api.get(url);
}

export function connectToFitbitApi(data) {
  return api.get(
    `${URL.CONNECT_TO_FITBIT}/${data.payload.patientId}`,
    data.payload.body
  );
}

export function getPatientActiveMinApi(data) {
  const baseUrl = `${URL.PATIENT_ACTIVE_MIN}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getPatientHeartRateApi(data) {
  const baseUrl = `${URL.PATIENT_HEART_RATE}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getFilterDataApi(data) {
  const baseUrl = `${URL.GET_FILTER_DATA}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getPatientCaloriesConsumedApi(data) {
  const baseUrl = `${URL.CALORIES_CONSUMED}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function getPatientSleepStagesApi(data) {
  let url = `${URL.PATIENT_SLEEP_STAGES}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  if (data.payload.period) url += `&period=${data.payload.period}`;
  if (data.payload.type) url += `&type=${data.payload.type}`;
  return api.get(url);
}

export function getExerciseSessionsApi(data) {
  const baseUrl = `${URL.GET_EXERCISE_SESSIONS}/${data.payload.patientId}?field=${data.payload.field}&start=${data.payload.start}&end=${data.payload.end}`;
  const url = data.payload.period
    ? `${baseUrl}&period=${data.payload.period}`
    : baseUrl;
  return api.get(url);
}

export function syncDataApi(data) {
  return api.create(`${URL.SYNC_DATA}/${data.payload.id}/sync`);
}
