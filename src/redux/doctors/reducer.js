import DOCTOR_TYPES from './constant';

const GET_ALL_DOCTORS_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const CREATE_DOCTOR_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const UPDATE_DOCTOR_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const GET_STATES_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const GET_CITIES_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const GET_SKILLS_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const CREATE_SKILLS_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const GET_CATEGORY_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};


export const getAllDoctors = (state = GET_ALL_DOCTORS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DOCTOR_TYPES.GET_ALL_DOCTORS_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case DOCTOR_TYPES.GET_ALL_DOCTORS_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case DOCTOR_TYPES.GET_ALL_DOCTORS_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const createDoctorReducer = (state = CREATE_DOCTOR_INITIAL_STATE, action) => {
    switch (action.type) {
        case DOCTOR_TYPES.CREATE_DOCTOR_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DOCTOR_TYPES.CREATE_DOCTOR_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DOCTOR_TYPES.CREATE_DOCTOR_RESET:
            return {
                data: [],
                loading: false
            }
        case DOCTOR_TYPES.CREATE_DOCTOR_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return  state 
    }
}

export const updateDoctor = (state = UPDATE_DOCTOR_INITIAL_STATE, action) => {
    switch (action.type) {
        case DOCTOR_TYPES.UPDATE_DOCTOR_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DOCTOR_TYPES.UPDATE_DOCTOR_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DOCTOR_TYPES.UPDATE_DOCTOR_RESET:
            return {
                data: [],
                loading: false
            }
        case DOCTOR_TYPES.UPDATE_DOCTOR_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return  state 
    }
}

export const getStatesReducer = (state = GET_STATES_INITIAL_STATE, action) => {
    switch (action.type) {
        case DOCTOR_TYPES.GET_STATES_LOADING:
            return {
                ...state,
                loading: true
            }
        case DOCTOR_TYPES.GET_STATES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DOCTOR_TYPES.GET_STATES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

export const getCitiesReducer = (state = GET_CITIES_INITIAL_STATE, action) => {
    switch (action.type) {
        case DOCTOR_TYPES.GET_CITIES_LOADING:
            return {
                ...state,
                loading: true
            }
        case DOCTOR_TYPES.GET_CITIES_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DOCTOR_TYPES.GET_CITIES_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

export const getSkillsReducer = (state = GET_SKILLS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DOCTOR_TYPES.GET_SKILLS_LOADING:
            return {
                ...state,
                loading: true
            }
        case DOCTOR_TYPES.GET_SKILLS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DOCTOR_TYPES.GET_SKILLS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

export const createSkillsReducer = (state = CREATE_SKILLS_INITIAL_STATE, action) => {
    switch (action.type) {
        case DOCTOR_TYPES.CREATE_SKILLS_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case DOCTOR_TYPES.CREATE_SKILLS_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DOCTOR_TYPES.CREATE_SKILLS_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

export const getCategoryReducer = (state = GET_CATEGORY_INITIAL_STATE, action) => {
    switch (action.type) {
        case DOCTOR_TYPES.GET_CATEGORY_LOADING:
            return {
                ...state,
                loading: true
            }
        case DOCTOR_TYPES.GET_CATEGORY_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case DOCTOR_TYPES.GET_CATEGORY_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return state
    }
}

