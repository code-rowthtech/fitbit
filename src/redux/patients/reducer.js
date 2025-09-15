import PATIENT_TYPES from './constant';

const GET_ALL_PATIENTS_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const GET_PATIENT_BY_ID_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const CREATE_PATIENT_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const UPDATE_PATIENT_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const GET_ALLERGIES_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};


export const getAllPatients = (state = GET_ALL_PATIENTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_TYPES.GET_ALL_PATIENTS_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case PATIENT_TYPES.GET_ALL_PATIENTS_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case PATIENT_TYPES.GET_ALL_PATIENTS_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getPatientByIdReducer = (state = GET_PATIENT_BY_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_TYPES.GET_PATIENT_BY_ID_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PATIENT_TYPES.GET_PATIENT_BY_ID_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PATIENT_TYPES.GET_PATIENT_BY_ID_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return  state
    }
}

export const createPatientReducer = (state = CREATE_PATIENT_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_TYPES.CREATE_PATIENT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PATIENT_TYPES.CREATE_PATIENT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PATIENT_TYPES.CREATE_PATIENT_RESET:
            return {
                data: {},
                loading: false
            }
        case PATIENT_TYPES.CREATE_PATIENT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return  {...state} 
    }
}

export const updatePatient = (state = UPDATE_PATIENT_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_TYPES.UPDATE_PATIENT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case PATIENT_TYPES.UPDATE_PATIENT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PATIENT_TYPES.UPDATE_PATIENT_RESET:
            return {
                data: [],
                loading: false
            }
        case PATIENT_TYPES.UPDATE_PATIENT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return  state 
    }
}

export const getAllergiesReducer = (state = GET_ALLERGIES_INITIAL_STATE, action) => {
    switch (action.type) {
        case PATIENT_TYPES.GET_ALLERGIES_LOADING:
            return {
                ...state,
                loading: true
            }
        case PATIENT_TYPES.GET_ALLERGIES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case PATIENT_TYPES.GET_ALLERGIES_ERROR:
            return {
                message: action.payload,
                loading: false
            }
        default: return state
    }
}
