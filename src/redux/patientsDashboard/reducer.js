import PATIENT_DASHBOARD_TYPES from './constant';

const GET_PATIENT_PROFILE_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const GET_PATIENT_ACTIVITY_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const GET_PATIENT_SLEEP_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const GET_PATIENT_WATER_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const GET_PATIENT_HEART_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const GET_PATIENT_WEIGHT_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const GET_PATIENT_BODY_FAT_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const GET_PATIENT_FOOD_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const GET_PATIENT_DEVICES_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const GET_PATIENT_GPS_TRACKING_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const CONNECT_TO_FITBIT_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

export const getPatientProfile = (state = GET_PATIENT_PROFILE_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_PROFILE_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getPatientActivity = (state = GET_PATIENT_ACTIVITY_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVITY_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVITY_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_ACTIVITY_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getPatientSleep = (state = GET_PATIENT_SLEEP_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_SLEEP_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getPatientWater = (state = GET_PATIENT_WATER_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_WATER_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_WATER_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_WATER_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getPatientHeart = (state = GET_PATIENT_HEART_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_HEART_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getPatientWeight = (state = GET_PATIENT_WEIGHT_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_WEIGHT_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_WEIGHT_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_WEIGHT_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getPatientBodyFat = (state = GET_PATIENT_BODY_FAT_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_BODY_FAT_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_BODY_FAT_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_BODY_FAT_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getPatientFood = (state = GET_PATIENT_FOOD_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_FOOD_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_FOOD_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_FOOD_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getPatientDevices = (state = GET_PATIENT_DEVICES_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_DEVICES_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_DEVICES_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_DEVICES_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getPatientGpsTracking = (state = GET_PATIENT_GPS_TRACKING_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_GPS_TRACKING_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_GPS_TRACKING_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.GET_PATIENT_GPS_TRACKING_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const connectToFitbit = (state = CONNECT_TO_FITBIT_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_DASHBOARD_TYPES.CONNECT_TO_FITBIT_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_DASHBOARD_TYPES.CONNECT_TO_FITBIT_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_DASHBOARD_TYPES.CONNECT_TO_FITBIT_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};
