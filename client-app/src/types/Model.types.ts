import { Model } from '../models/Model';

export type ModelState = {
    models: Array<Model>;
};

export enum ModelActionTypes {
    GET_ALL_MODELS_SUCCESS = 'GET_ALL_MODELS_SUCCESS',

    ADD_MODEL_SUCCESS = 'ADD_MODEL_SUCCESS',

    EDIT_MODEL_SUCCESS = 'EDIT_MODEL_SUCCESS',

    DELETE_MODEL_SUCCESS = 'DELETE_MODEL_SUCCESS',
}

type GetModelsSuccessAction = {
    type: ModelActionTypes.GET_ALL_MODELS_SUCCESS;
    payload: Array<Model>;
};

type ModifyModelSuccessAction = {
    type:
        | ModelActionTypes.ADD_MODEL_SUCCESS
        | ModelActionTypes.EDIT_MODEL_SUCCESS
        | ModelActionTypes.DELETE_MODEL_SUCCESS;
    payload: Model;
};

export type ModelActions = GetModelsSuccessAction | ModifyModelSuccessAction;
