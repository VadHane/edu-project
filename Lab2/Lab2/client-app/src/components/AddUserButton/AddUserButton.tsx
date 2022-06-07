import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddUserButton.css';

const AddUserButton: FunctionComponent = () => {
    const navigate = useNavigate();

    const onClickHandler = () => {
        const pathToAddingUser = '/add';

        navigate(pathToAddingUser);
    };

    return <button onClick={onClickHandler}>Add new user</button>;
};

export default AddUserButton;
