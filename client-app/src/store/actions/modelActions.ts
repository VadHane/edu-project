import { Dispatch } from 'redux';
import {
    DELETENG_MODEL_EXCEPTION,
    EDITING_MODEL_EXCEPTION,
    LOADING_MODELS_EXCEPTION,
    UNAUTHORIZED_EXCEPTION,
} from '../../exceptions';
import { IStoreActionCallback } from '../../models/IStoreActionCallback';
import { Model } from '../../models/Model';
import {
    addModelAsync,
    getAllModelsAsync,
    editModelAsync,
    deleteModelAsync,
} from '../../services/modelService';
import { Maybe } from '../../types/App.types';
import { ModelActionTypes } from '../../types/Model.types';
import { logout } from './authActions';

export const getAllModels = (callback?: IStoreActionCallback) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch) => {
        try {
            const response = await getAllModelsAsync();

            dispatchEvent({
                type: ModelActionTypes.GET_ALL_MODELS_SUCCESS,
                payload: response,
            });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);

                error = e;
            }

            isDone = false;
            error = error || LOADING_MODELS_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};

export const addNewModel = (
    model: Model,
    file: File,
    preview: File,
    callback?: IStoreActionCallback,
) => {
    let isDone = false;
    let error: Maybe<string> = undefined;
    return async (dispatchEvent: Dispatch) => {
        try {
            const response = await addModelAsync(model, file, preview);

            dispatchEvent({
                type: ModelActionTypes.ADD_MODEL_SUCCESS,
                payload: response,
            });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);

                error = e;
            }

            error = error || LOADING_MODELS_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};

export const editModel = (
    model: Model,
    file: File,
    preview: File,
    callback?: IStoreActionCallback,
) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch) => {
        try {
            const response = await editModelAsync(model, file, preview);

            dispatchEvent({
                type: ModelActionTypes.EDIT_MODEL_SUCCESS,
                payload: response,
            });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);

                error = e;
            }

            error = error || EDITING_MODEL_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};

export const deleteModel = (model: Model, callback?: IStoreActionCallback) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch) => {
        try {
            const response = await deleteModelAsync(model);

            dispatchEvent({
                type: ModelActionTypes.DELETE_MODEL_SUCCESS,
                payload: response,
            });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);
                error = e;
            }

            error = error || DELETENG_MODEL_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};
