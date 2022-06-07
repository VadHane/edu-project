/* eslint-disable indent */
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Role } from '../../../models/Role';
import AvailableRolesListProps from './AvailableRolesList.types';
import { APPROVE_IMAGE, CANSEL_IMAGE } from '../../../constants';
import './AvailableRolesList.css';

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
                value={inputNameOfRole}
                maxLength={30}
                onChange={(e) => setInputNameOfRole(e.target.value)}
            />
        </div>
    );

    const approveAddingNewRoleNode: React.ReactNode = (
        <div className="aprove-add-role">
            <span>Would you like to create new role - {inputNameOfRole}?</span> <br />
            <img
                src={APPROVE_IMAGE.URL}
                alt={APPROVE_IMAGE.ALT}
                onClick={() => {
                    props.createNewRole({ id: '', name: inputNameOfRole });
                    setItNewRole(false);
                }}
            />
            <img
                src={CANSEL_IMAGE.URL}
                alt={CANSEL_IMAGE.ALT}
                onClick={() => setInputNameOfRole('')}
            />
        </div>
    );

    const approveAddingAvailableRoleNode: React.ReactNode = (
        <div className="aprove-add-role">
            <span>Would you like to add this role?</span> <br />
            <img
                src={APPROVE_IMAGE.URL}
                alt={APPROVE_IMAGE.ALT}
                onClick={() => {
                    props.addRole(getRoleByName(inputNameOfRole));
                    setInputNameOfRole('');
                }}
            />
            <img
                src={CANSEL_IMAGE.URL}
                alt={CANSEL_IMAGE.ALT}
                onClick={() => setInputNameOfRole('')}
            />
        </div>
    );

    const approveAddingNode: React.ReactNode = (
        <>{!isRoleNew ? approveAddingAvailableRoleNode : approveAddingNewRoleNode}</>
    );

    const roleWasAddedNode: React.ReactNode = (
        <div>
            <span>Roles list includes this role.</span> <br />
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
