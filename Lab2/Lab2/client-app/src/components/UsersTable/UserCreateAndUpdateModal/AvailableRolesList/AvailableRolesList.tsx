/* eslint-disable indent */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Role } from '../../../../models/Role';
import AvailableRolesListProps from './AvailableRolesList.types';
import './AvailableRolesList.css';
import { APPROVE_IMAGE_URL, CANSEL_IMAGE_URL } from '../../../../constants';

const AvailableRolesList: FunctionComponent<AvailableRolesListProps> = (
    props: AvailableRolesListProps,
) => {
    const [roles, setRoles] = useState<Array<Role>>(props.roles);
    const [inputNameOfRole, setInputNameOfRole] = useState<string>('');
    const [itNewRole, setItNewRole] = useState<boolean>(false);
    const [itAddedRole, setItAddedRole] = useState<boolean>(false);

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

    const inputBox: React.ReactNode = (
        <div>
            <datalist id="available-roles-list">
                {roles?.map((role: Role) => (
                    <option value={role.name} key={role.id}></option>
                ))}
            </datalist>
            <input
                type="text"
                list="available-roles-list"
                value={inputNameOfRole}
                maxLength={30}
                onChange={(e) => setInputNameOfRole(e.target.value)}
            />
        </div>
    );

    const approveAddingNewRole: React.ReactNode = (
        <div className="aprove-add-role">
            <span>Would you like to create new role - {inputNameOfRole}?</span> <br />
            <img
                src={APPROVE_IMAGE_URL}
                alt="Aprove"
                onClick={() => {
                    props.createNewRole({ id: '', name: inputNameOfRole });
                    setItNewRole(false);
                }}
            />
            <img
                src={CANSEL_IMAGE_URL}
                alt="Cancel"
                onClick={() => setInputNameOfRole('')}
            />
        </div>
    );

    const approveAddingAvailableRole: React.ReactNode = (
        <div className="aprove-add-role">
            <span>Would you like to add this role?</span> <br />
            <img
                src={APPROVE_IMAGE_URL}
                alt="Approve"
                onClick={() => {
                    props.addRole(getRoleByName(inputNameOfRole));
                    setInputNameOfRole('');
                }}
            />
            <img
                src={CANSEL_IMAGE_URL}
                alt="Cancel"
                onClick={() => setInputNameOfRole('')}
            />
        </div>
    );

    const roleWasAdd: React.ReactNode = (
        <div>
            <span>Roles list includes this role.</span> <br />
            <img
                src={APPROVE_IMAGE_URL}
                alt="Ok"
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
            {inputBox}
            {itAddedRole
                ? roleWasAdd
                : inputNameOfRole.length > 1
                ? !itNewRole
                    ? approveAddingAvailableRole
                    : approveAddingNewRole
                : ''}
        </div>
    );
};

export default AvailableRolesList;
