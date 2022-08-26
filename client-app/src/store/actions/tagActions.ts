import { Dispatch } from 'redux';
import {
    ADDING_TAG_EXCEPTION,
    LOADING_TAGS_EXCEPTION,
    UNAUTHORIZED_EXCEPTION,
} from '../../exceptions';
import { IStoreActionCallback } from '../../models/IStoreActionCallback';
import { Tag } from '../../models/Tag';
import { createNewTagAsync, getAllTagsAsync } from '../../services/tagService';
import { Maybe } from '../../types/App.types';
import { TagActionTypes } from '../../types/Tag.types';
import { logout } from './authActions';

export const getAllTags = (callback?: IStoreActionCallback) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch) => {
        try {
            const response = await getAllTagsAsync();

            dispatchEvent({
                type: TagActionTypes.GET_ALL_TAGS_SUCCESS,
                payload: response,
            });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);

                error = e;
            }

            error = error || LOADING_TAGS_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};

export const addNewTag = (tag: Tag, callback?: IStoreActionCallback) => {
    let isDone = false;
    let error: Maybe<string> = undefined;

    return async (dispatchEvent: Dispatch) => {
        try {
            const response = await createNewTagAsync(tag);

            dispatchEvent({ type: TagActionTypes.ADD_TAG_SUCCESS, payload: response });

            isDone = true;
        } catch (e) {
            if (e === UNAUTHORIZED_EXCEPTION) {
                logout()(dispatchEvent);

                error = e;
            }

            error = error || ADDING_TAG_EXCEPTION;
        } finally {
            callback && callback(isDone, error);
        }
    };
};
