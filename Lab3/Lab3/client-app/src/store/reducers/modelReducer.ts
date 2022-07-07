import { ModelState, ModelActions, ModelActionTypes } from '../../types/Model.types';

const initialState: ModelState = {
    models: [],
    loading: false,
    loaded: false,
    error: null,
    actionWasDone: null,
};

export const modelReducer = (state = initialState, action: ModelActions): ModelState => {
    switch (action.type) {
        case ModelActionTypes.GET_ALL_MODELS:
            return {
                models: [],
                loading: true,
                loaded: false,
                error: null,
                actionWasDone: null,
            };
        case ModelActionTypes.GET_ALL_MODELS_SUCCESS:
            return {
                models: [...action.payload],
                loading: false,
                loaded: true,
                error: null,
                actionWasDone: null,
            };
        case ModelActionTypes.GET_ALL_MODELS_ERROR:
            return {
                models: [],
                loading: false,
                loaded: false,
                error: action.payload,
                actionWasDone: null,
            };
        case ModelActionTypes.ADD_MODEL:
            return {
                models: state.models,
                loading: true,
                loaded: true,
                error: null,
                actionWasDone: null,
            };
        case ModelActionTypes.ADD_MODEL_SUCCESS:
            return {
                models: [...state.models, action.payload],
                loading: false,
                loaded: false,
                error: null,
                actionWasDone: true,
            };
        case ModelActionTypes.ADD_MODEL_ERROR:
            return {
                models: state.models,
                loading: false,
                loaded: false,
                error: action.payload,
                actionWasDone: false,
            };
        case ModelActionTypes.EDIT_MODEL:
            return {
                models: state.models,
                loading: true,
                loaded: true,
                error: null,
                actionWasDone: null,
            };
        case ModelActionTypes.EDIT_MODEL_SUCCESS:
            return {
                models: [
                    ...state.models.filter((model) => model.id !== action.payload.id),
                    action.payload,
                ],
                loading: false,
                loaded: false,
                error: null,
                actionWasDone: true,
            };
        case ModelActionTypes.EDIT_MODEL_ERROR:
            return {
                models: state.models,
                loading: false,
                loaded: false,
                error: action.payload,
                actionWasDone: false,
            };
        case ModelActionTypes.DELETE_MODEL:
            return {
                models: state.models,
                loading: true,
                loaded: true,
                error: null,
                actionWasDone: null,
            };
        case ModelActionTypes.DELETE_MODEL_SUCCESS:
            return {
                models: [
                    ...state.models.filter((model) => model.id !== action.payload.id),
                ],
                loading: false,
                loaded: false,
                error: null,
                actionWasDone: true,
            };
        case ModelActionTypes.DELETE_MODEL_ERROR:
            return {
                models: state.models,
                loading: false,
                loaded: false,
                error: action.payload,
                actionWasDone: false,
            };
        default:
            return state;
    }
};
