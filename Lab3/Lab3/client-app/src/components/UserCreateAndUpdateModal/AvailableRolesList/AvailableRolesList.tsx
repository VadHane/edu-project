/* eslint-disable indent */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Role } from '../../../models/Role';
import AvailableRolesListProps from './AvailableRolesList.types';
import { APPROVE_IMAGE, CANCEL_IMAGE } from '../../../App.constants';
import './AvailableRolesList.css';
import {
    ADD_ROLE_MESSAGE,
    GET_CREATE_ROLE_MESSAGE,
    LIST_INCLUDES_ROLE_MESSAGE,
    MAX_LENGTH_INPUT_BOX,
} from './AvailableRolesList.constants';

const AvailableRolesList: FunctionComponent<AvailableRolesListProps> = (
    props: AvailableRolesListProps,
) => {
    const [roles, setRoles] = useState<Array<Role>>(props.roles);
    const [inputNameOfRole, setInputNameOfRole] = useState<string>('');
    const [isRoleNew, setItNewRole] = useState<boolean>(false);
    const [isRoleAdded, setItAddedRole] = useState<boolean>(false);

    useEffect(() => {
        setRoles([...props.roles]);
    }, [props.roles]);

    useEffect(() => {
        const availableInList: boolean =
            !roles.find((role: Role) => role.name === inputNameOfRole) &&
            inputNameOfRole.length > 1;

        const added: boolean = props.addedRoles.find(
            (role: Role) => role.name === inputNameOfRole,
        )
            ? true
            : false;

        setItNewRole(availableInList);
        setItAddedRole(added);
    }, [inputNameOfRole, props.addedRoles, roles]);

    const inputBoxNode: React.ReactNode = (
        <div>
            <datalist id="available-roles-list">
                {roles?.map((role: Role) => (
                    <option value={role.name} key={role.id}></option>
                ))}
            </datalist>
            <input
                type="text"
                list="available-roles-list"
                id="available-roles-list-input"
                value={inputNameOfRole}
                maxLength={MAX_LENGTH_INPUT_BOX}
                onChange={(e) => setInputNameOfRole(e.target.value)}
            />
        </div>
    );

    const approveAddingNewRoleNode: React.ReactNode = (
        <div className="aprove-add-role">
            <span>{GET_CREATE_ROLE_MESSAGE}</span> <br />
            <img
                src={APPROVE_IMAGE.URL}
                alt={APPROVE_IMAGE.ALT}
                onClick={() => {
                    props.createNewRole({ id: '', name: inputNameOfRole });
                    setItNewRole(false);
                }}
            />
            <img
                src={CANCEL_IMAGE.URL}
                alt={CANCEL_IMAGE.ALT}
                onClick={() => setInputNameOfRole('')}
            />
        </div>
    );

    const approveAddingAvailableRoleNode: React.ReactNode = (
        <div className="aprove-add-role">
            <span>{ADD_ROLE_MESSAGE}</span> <br />
            <img
                src={APPROVE_IMAGE.URL}
                alt={APPROVE_IMAGE.ALT}
                onClick={() => {
                    props.addRole(getRoleByName(inputNameOfRole));
                    setInputNameOfRole('');
                }}
            />
            <img
                src={CANCEL_IMAGE.URL}
                alt={CANCEL_IMAGE.ALT}
                onClick={() => setInputNameOfRole('')}
            />
        </div>
    );

    const approveAddingNode: React.ReactNode = (
        <>{!isRoleNew ? approveAddingAvailableRoleNode : approveAddingNewRoleNode}</>
    );

    const roleWasAddedNode: React.ReactNode = (
        <div>
            <span>{LIST_INCLUDES_ROLE_MESSAGE}</span> <br />
            <img
                src={APPROVE_IMAGE.URL}
                alt={APPROVE_IMAGE.ALT}
                onClick={() => setInputNameOfRole('')}
            />
        </div>
    );

    const getRoleByName = (roleName: String): Role => {
        const index = roles.findIndex((role: Role) => role.name === roleName);
        return roles[index];
    };

    return (
        <div>
            {inputBoxNode}
            {isRoleAdded
                ? roleWasAddedNode
                : inputNameOfRole.length > 1
                ? approveAddingNode
                : ''}
        </div>
    );
};

export default AvailableRolesList;