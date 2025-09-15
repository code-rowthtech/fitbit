import NOTE_TYPES from './constant';

const GET_ALL_NOTES_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const GET_NOTE_BY_ID_INITIAL_STATE = {
    data: {},
    message: '',
    loading: false,
};

const CREATE_NOTE_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

const UPDATE_NOTE_INITIAL_STATE = {
    data: [],
    message: '',
    loading: false,
};

export const getAllNotes = (state = GET_ALL_NOTES_INITIAL_STATE, action) => {
    switch (action.type) {
        case NOTE_TYPES.GET_ALL_NOTES_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case NOTE_TYPES.GET_ALL_NOTES_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case NOTE_TYPES.GET_ALL_NOTES_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const getNoteById = (state = GET_NOTE_BY_ID_INITIAL_STATE, action) => {
    switch (action.type) {
        case NOTE_TYPES.GET_NOTE_BY_ID_LOADING:
            return {
                loading: true,
                data: state.data,
            };
        case NOTE_TYPES.GET_NOTE_BY_ID_SUCCESS:
            return {
                loading: false,
                data: action?.payload,
            };
        case NOTE_TYPES.GET_NOTE_BY_ID_ERROR:
            return {
                loading: false,
                message: action?.payload,
            };
        default:
            return state;
    }
};

export const createNoteReducer = (state = CREATE_NOTE_INITIAL_STATE, action) => {
    switch (action.type) {
        case NOTE_TYPES.CREATE_NOTE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case NOTE_TYPES.CREATE_NOTE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case NOTE_TYPES.CREATE_NOTE_RESET:
            return {
                data: [],
                loading: false
            }
        case NOTE_TYPES.CREATE_NOTE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return  state 
    }
}

export const updateNoteReducer = (state = UPDATE_NOTE_INITIAL_STATE, action) => {
    switch (action.type) {
        case NOTE_TYPES.UPDATE_NOTE_LOADING:
            return {
                data: state.data,
                loading: true
            }
        case NOTE_TYPES.UPDATE_NOTE_SUCCESS:
            return {
                data: action.payload,
                loading: false
            }
        case NOTE_TYPES.UPDATE_NOTE_RESET:
            return {
                data: [],
                loading: false
            }
        case NOTE_TYPES.UPDATE_NOTE_ERROR:
            return {
                data: action.payload,
                loading: false
            }
        default: return  state 
    }
}

