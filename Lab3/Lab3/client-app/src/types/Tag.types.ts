import { Tag } from '../models/Tag';

export type TagState = {
    tags: Array<Tag>;
    loading: boolean;
    loaded: boolean;
    error: Nullable<string>;
};

export enum TagActionTypes {
    GET_ALL_TAGS = 'GET_ALL_TAGS',
    GET_ALL_TAGS_SUCCESS = 'GET_ALL_TAGS_SUCCESS',
    GET_ALL_TAGS_ERROR = 'GET_ALL_TAGS_ERROR',

    ADD_TAG = 'ADD_TAG',
    ADD_TAG_SUCCESS = 'ADD_TAG_SUCCESS',
    ADD_TAG_ERROR = 'ADD_TAG_ERROR',
}

type getTagsStartAction = {
    type: TagActionTypes.GET_ALL_TAGS;
};

type getTagsSuccessAction = {
    type: TagActionTypes.GET_ALL_TAGS_SUCCESS;
    payload: Array<Tag>;
};

type getTagsErrorAction = {
    type: TagActionTypes.GET_ALL_TAGS_ERROR;
    payload: string;
};

type getTagsAction = getTagsStartAction | getTagsSuccessAction | getTagsErrorAction;

type addTagStartAction = {
    type: TagActionTypes.ADD_TAG;
};

type addTagSuccessAction = {
    type: TagActionTypes.ADD_TAG_SUCCESS;
    payload: Tag;
};

type addTagErrorAction = {
    type: TagActionTypes.ADD_TAG_ERROR;
    payload: string;
};

type addTagActions = addTagStartAction | addTagSuccessAction | addTagErrorAction;

export type TagActions = getTagsAction | addTagActions;
