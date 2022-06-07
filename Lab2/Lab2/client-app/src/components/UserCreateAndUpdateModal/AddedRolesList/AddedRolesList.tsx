import React, { FunctionComponent, useEffect, useState } from 'react';
import { Role } from '../../../models/Role';
import AddedRolesListProps from './AddedRolesList.types';
import { REMOVE_IMAGE } from '../../../constants';
import './AddedRolesList.css';

const AddedRolesList: FunctionComponent<AddedRolesListProps> = (
    props: AddedRolesListProps,
) => {
    const [roles, setRoles] = useState<Array<Role>>(props.roles);

    useEffect(() => {
        setRoles([...props.roles]);
    }, [props.roles]);

    return (
        <div className="role-list">
            {roles?.map((role: Role) => (
                <div className="list-row" key={role.id}>
                    <span>
                        {role.name}
                        <img
                            src={REMOVE_IMAGE.URL}
                            alt={REMOVE_IMAGE.ALT}
                            onClick={() => props.removeAddedRole(role)}
                        />
                    </span>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default AddedRolesList;
