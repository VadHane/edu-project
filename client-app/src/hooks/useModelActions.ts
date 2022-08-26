import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as modelActions from '../store/actions/modelActions';

export const useModelActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators(modelActions, dispatch);
};
