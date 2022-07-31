import { Model } from '../models/Model';

export type ModelState = {
    models: Array<Model>;
    loading: boolean;
    loaded: boolean;
    error: Nullable<string>;
    actionWasDone: Nullable<boolean>;
};

export enum ModelActionTypes {
    GET_ALL_MODELS = 'GET_ALL_MODELS',
    GET_ALL_MODELS_SUCCESS = 'GET_ALL_MODELS_SUCCESS',
    GET_ALL_MODELS_ERROR = 'GET_ALL_MODELS_ERROR',

    ADD_MODEL = 'ADD_MODEL',
    ADD_MODEL_SUCCESS = 'ADD_MODEL_SUCCESS',
    ADD_MODEL_ERROR = 'ADD_MODEL_ERROR',

    EDIT_MODEL = 'EDIT_MODEL',
    EDIT_MODEL_SUCCESS = 'EDIT_MODEL_SUCCESS',
    EDIT_MODEL_ERROR = 'EDIT_MODEL_ERROR',

    DELETE_MODEL = 'DELETE_MODEL',
    DELETE_MODEL_SUCCESS = 'DELETE_MODEL_SUCCESS',
    DELETE_MODEL_ERROR = 'DELETE_MODEL_ERROR',

    RESET = 'RESET',
}

type GetModelsStartAction = {
    type: ModelActionTypes.GET_ALL_MODELS;
};

type GetModelsSuccessAction = {
    type: ModelActionTypes.GET_ALL_MODELS_SUCCESS;
    payload: Array<Model>;
};

type GetModelsErrorAction = {
    type: ModelActionTypes.GET_ALL_MODELS_ERROR;
    payload: string;
};

type GetModelActions =
    | GetModelsStartAction
    | GetModelsSuccessAction
    | GetModelsErrorAction;

type ModifyModelStartAction = {
    type:
        | ModelActionTypes.ADD_MODEL
        | ModelActionTypes.EDIT_MODEL
        | ModelActionTypes.DELETE_MODEL;
};

type ModifyModelSuccessAction = {
    type:
        | ModelActionTypes.ADD_MODEL_SUCCESS
        | ModelActionTypes.EDIT_MODEL_SUCCESS
        | ModelActionTypes.DELETE_MODEL_SUCCESS;
    payload: Model;
};

type ModifyModelErrorAction = {
    type:
        | ModelActionTypes.ADD_MODEL_ERROR
        | ModelActionTypes.EDIT_MODEL_ERROR
        | ModelActionTypes.DELETE_MODEL_ERROR;
    payload: string;
};

type ModifyModelActions =
    | ModifyModelStartAction
    | ModifyModelSuccessAction
    | ModifyModelErrorAction;

type ResetModelAction = {
    type: ModelActionTypes.RESET;
};

export type ModelActions = GetModelActions | ModifyModelActions | ResetModelAction;
