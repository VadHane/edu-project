import { Dispatch } from 'redux';
import { ADDING_TAG_EXCEPTION, LOADING_TAGS_EXCEPTION } from '../../exceptions';
import { Tag } from '../../models/Tag';
import { createNewTagAsync, getAllTagsAsync } from '../../services/tagService';
import { TagActionTypes } from '../../types/Tag.types';

export const getAllTags = () => {
    return async (dispatchEvent: Dispatch) => {
        try {
            dispatchEvent({ type: TagActionTypes.GET_ALL_TAGS });

            const response = await getAllTagsAsync();

            dispatchEvent({
                type: TagActionTypes.GET_ALL_TAGS_SUCCESS,
                payload: response,
            });
        } catch {
            dispatchEvent({
                type: TagActionTypes.GET_ALL_TAGS_ERROR,
                payload: LOADING_TAGS_EXCEPTION,
            });
        }
    };
};

export const addNewTag = (tag: Tag) => {
    return async (dispatchEvent: Dispatch) => {
        try {
            dispatchEvent({ type: TagActionTypes.ADD_TAG });

            const response = await createNewTagAsync(tag);

            dispatchEvent({ type: TagActionTypes.ADD_TAG_SUCCESS, payload: response });
        } catch {
            dispatchEvent({
                type: TagActionTypes.ADD_TAG_ERROR,
                payload: ADDING_TAG_EXCEPTION,
            });
        }
    };
};
