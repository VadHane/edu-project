import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from './../store/actions/userActions';

export const useUserActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(userActions, dispatch);
};
