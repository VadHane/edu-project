import { ModelState, ModelActions, ModelActionTypes } from '../../types/Model.types';

const initialState: ModelState = {
    models: [],
};

export const modelReducer = (state = initialState, action: ModelActions): ModelState => {
    switch (action.type) {
        case ModelActionTypes.GET_ALL_MODELS_SUCCESS:
            return {
                models: [...action.payload],
            };
        case ModelActionTypes.ADD_MODEL_SUCCESS:
            return {
                models: [...state.models, action.payload],
            };
        case ModelActionTypes.EDIT_MODEL_SUCCESS:
            return {
                models: [
                    ...state.models.filter((model) => model.id !== action.payload.id),
                    action.payload,
                ],
            };
        case ModelActionTypes.DELETE_MODEL_SUCCESS:
            return {
                models: [
                    ...state.models.filter((model) => model.id !== action.payload.id),
                ],
            };
        default:
            return state;
    }
};
