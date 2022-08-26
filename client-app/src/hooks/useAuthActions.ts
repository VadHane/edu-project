import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authActions from '../store/actions/authActions';

export const useAuthActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(authActions, dispatch);
};
