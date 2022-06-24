import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserWarningModalProps } from './UserWarningModal.types';
import './UserWarningModal.css';

const UserWarningModal: FunctionComponent<UserWarningModalProps> = (
    props: UserWarningModalProps,
) => {
    const navigate = useNavigate();

    const onClickDefaultHandler = (): void => {
        navigate('/');
    };

    return (
        <div className="warning-modal-wrapper">
            <div className="warning-modal-window">
                <span className="warning-modal-message">{props.message}</span>
                <span
                    className="warning-modal-button"
                    onClick={props.onClick ?? onClickDefaultHandler}
                >
                    Ok
                </span>
            </div>
        </div>
    );
};

export default UserWarningModal;
