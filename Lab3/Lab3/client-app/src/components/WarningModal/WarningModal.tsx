import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserWarningModalProps as WarningModalProps } from './WarningModal.types';
import './WarningModal.css';

const UserWarningModal: FunctionComponent<WarningModalProps> = (
    props: WarningModalProps,
) => {
    const navigate = useNavigate();

    const onClickDefaultHandler = (): void => {
        navigate(props.navigateTo || '/');
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
