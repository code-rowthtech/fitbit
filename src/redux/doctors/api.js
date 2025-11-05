import * as URL from "../../constants/endpoint";
import { APICore } from "../../helpers/api/apiCore";
const api = new APICore();

export function getAllDoctorsApi(data) {
  const params = new URLSearchParams();
  if (data.payload?.page) params.append("page", data.payload.page);
  if (data.payload?.limit) params.append("limit", data.payload.limit);
  if (data.payload?.search) params.append("search", data.payload.search);
  if (data.payload?.paginate !== undefined)
    params.append("paginate", data.payload.paginate);
  if (data.payload?.isActive !== undefined)
    params.append("isActive", data.payload.isActive);

  return api.get(`${URL.GET_DOCTORS}?${params.toString()}`);
}

export function getSingleDoctorApi() {
  return api.get(URL.GET_SINGLE_DOCTOR);
}

export function createDoctorApi(data) {
  // Check if payload is FormData
  if (data.payload instanceof FormData) {
    return api.createWithFile(URL.DOCTORS, data.payload);
  }
  return api.create(URL.DOCTORS, data.payload);
}

export function updateDoctorApi(data) {
  return api.update(
    `${URL.UPDATE_DOCTOR}/${data.payload.doctorId}`,
    data.payload.body
  );
}

export function getStatesApi(data) {
  return api.get(
    `${URL.GET_STATES}?search=${data?.search || ""}&limit=${data?.limit || 40}`
  );
}

export function getCitiesApi(data) {
  return api.get(
    `${URL.GET_CITIES}/${data?.stateCode?.value}/cities?search=${
      data?.search || ""
    }`
  );
}

export function getSkillsApi(data) {
  return api.get(`${URL.GET_SKILLS}`);
}

export function createSkillsApi(data) {
  return api.create(URL.CREATE_SKILLS, data.payload);
}

export function getCategoryApi() {
  return api.get(`${URL.GET_CATEGORY}?type=category`);
}

export function getSpecializationsApi(data) {
  return api.get(`${URL.GET_SPECIALIZATIONS}`);
}

export function createSpecializationsApi(data) {
  return api.create(URL.CREATE_SPECIALIZATIONS, data.payload);
}

export function getSpecializationsCategoryApi() {
  return api.get(`${URL.GET_SPECIALIZATIONS_CATEGORY}?type=category`);
}

export function createDegreeApi(data) {
  return api.create(URL.CREATE_DEGREE, data.payload);
}

export function getQualificationApi() {
  return api.get(`${URL.GET_QUALIFICATION}`);
}
