import { Dispatch } from 'redux';
import {
    ADDING_MODEL_EXCEPTION,
    DELETENG_MODEL_EXCEPTION,
    EDITING_MODEL_EXCEPTION,
    LOADING_MODELS_EXCEPTION,
    UNAUTHORIZED_EXCEPTION,
} from '../../exceptions';
import { Model } from '../../models/Model';
import {
    addModelAsync,
    getAllModelsAsync,
    editModelAsync,
    deleteModelAsync,
} from '../../services/modelService';
import { ModelActionTypes } from '../../types/Model.types';
import { logout } from './authActions';

export const getAllModels = () => {
    return async (dispatchEvent: Dispatch) => {
        try {
            dispatchEvent({ type: ModelActionTypes.GET_ALL_MODELS });

            const response = await getAllModelsAsync();

            dispatchEvent({
                type: ModelActionTypes.GET_ALL_MODELS_SUCCESS,
                payload: response,
            });
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);
                return;
            }

            dispatchEvent({
                type: ModelActionTypes.GET_ALL_MODELS_ERROR,
                payload: LOADING_MODELS_EXCEPTION,
            });
        }
    };
};

export const addNewModel = (model: Model, file: File, preview: File) => {
    return async (dispatchEvent: Dispatch) => {
        try {
            dispatchEvent({ type: ModelActionTypes.ADD_MODEL });

            const response = await addModelAsync(model, file, preview);

            dispatchEvent({
                type: ModelActionTypes.ADD_MODEL_SUCCESS,
                payload: response,
            });
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);
                return;
            }

            dispatchEvent({
                type: ModelActionTypes.ADD_MODEL_ERROR,
                payload: ADDING_MODEL_EXCEPTION,
            });
        }
    };
};

export const editModel = (model: Model, file: File, preview: File) => {
    return async (dispatchEvent: Dispatch) => {
        try {
            dispatchEvent({ type: ModelActionTypes.EDIT_MODEL });

            const response = await editModelAsync(model, file, preview);

            dispatchEvent({
                type: ModelActionTypes.EDIT_MODEL_SUCCESS,
                payload: response,
            });
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);
                return;
            }

            dispatchEvent({
                type: ModelActionTypes.EDIT_MODEL_ERROR,
                payload: EDITING_MODEL_EXCEPTION,
            });
        }
    };
};

export const deleteModel = (model: Model) => {
    return async (dispatchEvent: Dispatch) => {
        try {
            dispatchEvent({ type: ModelActionTypes.DELETE_MODEL });

            const response = await deleteModelAsync(model);

            dispatchEvent({
                type: ModelActionTypes.DELETE_MODEL_SUCCESS,
                payload: response,
            });
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);
                return;
            }

            dispatchEvent({
                type: ModelActionTypes.DELETE_MODEL_ERROR,
                payload: DELETENG_MODEL_EXCEPTION,
            });
        }
    };
};
