import { TagState, TagActions, TagActionTypes } from '../../types/Tag.types';

const initialState: TagState = {
    tags: [],
};

export const tagReduser = (state = initialState, action: TagActions): TagState => {
    switch (action.type) {
        case TagActionTypes.GET_ALL_TAGS_SUCCESS:
            return {
                tags: action.payload,
            };
        case TagActionTypes.ADD_TAG_SUCCESS:
            return {
                tags: [...state.tags, action.payload],
            };
        default:
            return state;
    }
};
