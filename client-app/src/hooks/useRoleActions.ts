import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as roleActions from './../store/actions/roleActions';

export const useRoleActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(roleActions, dispatch);
};
