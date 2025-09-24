import REPORT_TYPES from './constant';

const GET_ALL_REPORTS_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const GET_REPORT_BY_ID_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const CREATE_REPORT_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const UPDATE_REPORT_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const DOWNLOAD_REPORT_INITIAL_STATE = {
    data: null,
    message: '',
    loading: false,
};

export const getAllReports = (state = GET_ALL_REPORTS_INITIAL_STATE, action) => {
    switch (action.type) {
        case REPORT_TYPES.GET_ALL_REPORTS_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case REPORT_TYPES.GET_ALL_REPORTS_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case REPORT_TYPES.GET_ALL_REPORTS_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getReportById = (state = GET_REPORT_BY_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case REPORT_TYPES.GET_REPORT_BY_ID_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case REPORT_TYPES.GET_REPORT_BY_ID_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case REPORT_TYPES.GET_REPORT_BY_ID_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const createReportReducer = (state = CREATE_REPORT_INITIAL_STATE, action) => {
    switch (action.type) {
        case REPORT_TYPES.CREATE_REPORT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case REPORT_TYPES.CREATE_REPORT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case REPORT_TYPES.CREATE_REPORT_RESET:
            return {
                data: [],
                loading: false
            }
        case REPORT_TYPES.CREATE_REPORT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return  state 
    }
}

export const updateReportReducer = (state = UPDATE_REPORT_INITIAL_STATE, action) => {
    switch (action.type) {
        case REPORT_TYPES.UPDATE_REPORT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case REPORT_TYPES.UPDATE_REPORT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case REPORT_TYPES.UPDATE_REPORT_RESET:
            return {
                data: [],
                loading: false
            }
        case REPORT_TYPES.UPDATE_REPORT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return  state 
    }
}

export const downloadReportReducer = (state = DOWNLOAD_REPORT_INITIAL_STATE, action) => {
    switch (action.type) {
        case REPORT_TYPES.DOWNLOAD_REPORT_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case REPORT_TYPES.DOWNLOAD_REPORT_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case REPORT_TYPES.DOWNLOAD_REPORT_RESET:
            return {
                data: null,
                loading: false
            }
        case REPORT_TYPES.DOWNLOAD_REPORT_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return  state 
    }
}