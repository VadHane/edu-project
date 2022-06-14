import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADD_USER_BUTTON_TEXT } from '../UsersTable/UsersTable.constants';
import './AddUserButton.css';

const AddUserButton: FunctionComponent = () => {
    const navigate = useNavigate();

    const onClickHandler = () => {
        const pathToAddingUser = '/add';

        navigate(pathToAddingUser);
    };

    return <button onClick={onClickHandler}>{ADD_USER_BUTTON_TEXT}</button>;
};

export default AddUserButton;
