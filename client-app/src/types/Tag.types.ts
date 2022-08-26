import { Tag } from '../models/Tag';

export type TagState = {
    tags: Array<Tag>;
};

export enum TagActionTypes {
    GET_ALL_TAGS_SUCCESS = 'GET_ALL_TAGS_SUCCESS',

    ADD_TAG_SUCCESS = 'ADD_TAG_SUCCESS',
}

type getTagsSuccessAction = {
    type: TagActionTypes.GET_ALL_TAGS_SUCCESS;
    payload: Array<Tag>;
};

type addTagSuccessAction = {
    type: TagActionTypes.ADD_TAG_SUCCESS;
    payload: Tag;
};

export type TagActions = getTagsSuccessAction | addTagSuccessAction;
