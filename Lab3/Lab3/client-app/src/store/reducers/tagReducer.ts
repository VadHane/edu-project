import { TagState, TagActions, TagActionTypes } from '../../types/Tag.types';

const initialState: TagState = {
    tags: [],
    loading: false,
    loaded: false,
    error: null,
};

export const tagReduser = (state = initialState, action: TagActions): TagState => {
    switch (action.type) {
        case TagActionTypes.GET_ALL_TAGS:
            return {
                tags: [],
                loading: true,
                loaded: false,
                error: null,
            };
        case TagActionTypes.GET_ALL_TAGS_SUCCESS:
            return {
                tags: action.payload,
                loading: false,
                loaded: true,
                error: null,
            };
        case TagActionTypes.GET_ALL_TAGS_ERROR:
            return {
                tags: [],
                loading: false,
                loaded: false,
                error: action.payload,
            };
        case TagActionTypes.ADD_TAG:
            return {
                tags: state.tags,
                loading: true,
                loaded: true,
                error: null,
            };
        case TagActionTypes.ADD_TAG_SUCCESS:
            return {
                tags: [...state.tags, action.payload],
                loading: true,
                loaded: false,
                error: null,
            };
        case TagActionTypes.ADD_TAG_ERROR:
            return {
                tags: state.tags,
                loading: false,
                loaded: false,
                error: action.payload,
            };
        default:
            return state;
    }
};
