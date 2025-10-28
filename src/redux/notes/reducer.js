import NOTES_TYPES from "./constant";

const ADD_NOTES_INITIAL_STATE = {
  data: [],
  message: "",
  loading: false,
};

const GET_NOTES_INITIAL_STATE = {
  data: [],
  message: "",
  loading: false,
};

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
    case NOTES_TYPES.GET_NOTES_LOADING:
      return {
        loading: true,
        data: state.data,
      };
    case NOTES_TYPES.GET_NOTES_SUCCESS:
      return {
        loading: false,
        data: action?.payload,
      };
    case NOTES_TYPES.GET_NOTES_ERROR:
      return {
        loading: false,
        message: action?.payload,
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