import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as tagActions from './../store/actions/tagActions';

export const useTagActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(tagActions, dispatch);
};
