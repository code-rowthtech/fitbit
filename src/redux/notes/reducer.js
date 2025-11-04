import NOTES_TYPES from "./constant";

const ADD_NOTES_INITIAL_STATE = {
  data: [],
  message: "",
  loading: false,
};

const GET_NOTES_INITIAL_STATE = { data: {}, loading: {}, error: {} };

const UPDATE_NOTES_INITIAL_STATE = {
  data: [],
  message: "",
  loading: false,
};

const DELETE_NOTES_INITIAL_STATE = {
  data: [],
  message: "",
  loading: false,
};

const GET_ALERTS_INITIAL_STATE = {
  data: [],
  message: "",
  loading: false,
};

const GET_MASTER_DATA_INITIAL_STATE = { data: {}, loading: {}, error: {} };

export const addNotesReducer = (
  state = ADD_NOTES_INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case NOTES_TYPES.ADD_NOTES_LOADING:
      return {
        data: state.data,
        loading: true,
      };
    case NOTES_TYPES.ADD_NOTES_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case NOTES_TYPES.ADD_NOTES_ERROR:
      return {
        data: action.payload,
        loading: false,
      };
    case NOTES_TYPES.ADD_NOTES_RESET:
      return {
        data: [],
        loading: false,
      };
    default:
      return state;
  }
};

export const getNotesReducer = (
  state = GET_NOTES_INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case NOTES_TYPES.GET_NOTES:
      return {
        ...state,
        loading: { ...state.loading, [action.payload.fieldKey]: true },
        error: { ...state.error, [action.payload.fieldKey]: null },
      };
    case NOTES_TYPES.GET_NOTES_SUCCESS:
      return {
        ...state,
        data: { ...state.data, [action.payload.fieldKey]: action.payload.data },
        loading: { ...state.loading, [action.payload.fieldKey]: false },
        error: { ...state.error, [action.payload.fieldKey]: null },
      };
    case NOTES_TYPES.GET_NOTES_ERROR:
      return {
        ...state,
        loading: { ...state.loading, [action.payload.fieldKey]: false },
        error: { ...state.error, [action.payload.fieldKey]: action.payload.error },
      };
    default:
      return state;
  }
};

export const updateNotesReducer = (
  state = UPDATE_NOTES_INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case NOTES_TYPES.UPDATE_NOTES_LOADING:
      return {
        data: state.data,
        loading: true,
      };
    case NOTES_TYPES.UPDATE_NOTES_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case NOTES_TYPES.UPDATE_NOTES_ERROR:
      return {
        data: action.payload,
        loading: false,
      };
    case NOTES_TYPES.UPDATE_NOTES_RESET:
      return {
        data: [],
        loading: false,
      };
    default:
      return state;
  }
};

export const deleteNotesReducer = (
  state = DELETE_NOTES_INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case NOTES_TYPES.DELETE_NOTES_LOADING:
      return {
        data: state.data,
        loading: true,
      };
    case NOTES_TYPES.DELETE_NOTES_SUCCESS:
      return {
        data: action.payload,
        loading: false,
      };
    case NOTES_TYPES.DELETE_NOTES_ERROR:
      return {
        data: action.payload,
        loading: false,
      };
    case NOTES_TYPES.DELETE_NOTES_RESET:
      return {
        data: [],
        loading: false,
      };
    default:
      return state;
  }
};

export const getAlertsReducer = (
  state = GET_ALERTS_INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case NOTES_TYPES.GET_ALERTS_LOADING:
      return {
        loading: true,
        data: state.data,
      };
    case NOTES_TYPES.GET_ALERTS_SUCCESS:
      return {
        loading: false,
        data: action?.payload,
      };
    case NOTES_TYPES.GET_ALERTS_ERROR:
      return {
        loading: false,
        message: action?.payload,
      };
    case NOTES_TYPES.GET_ALERTS_RESET:
      return {
        data: [],
        loading: false,
      };
    default:
      return state;
  }
};

export const getMasterDataReducer = (
  state = GET_MASTER_DATA_INITIAL_STATE,
  action
) => {
  switch (action.type) {
    case NOTES_TYPES.GET_MASTER_DATA:
      return {
        ...state,
        loading: { ...state.loading, [action.payload.fieldKey]: true },
        error: { ...state.error, [action.payload.fieldKey]: null },
      };
    case NOTES_TYPES.GET_MASTER_DATA_SUCCESS:
      return {
        ...state,
        data: { ...state.data, [action.payload.fieldKey]: action.payload.data },
        loading: { ...state.loading, [action.payload.fieldKey]: false },
        error: { ...state.error, [action.payload.fieldKey]: null },
      };
    case NOTES_TYPES.GET_MASTER_DATA_ERROR:
      return {
        ...state,
        loading: { ...state.loading, [action.payload.fieldKey]: false },
        error: { ...state.error, [action.payload.fieldKey]: action.payload.error },
      };
    default:
      return state;
  }
};