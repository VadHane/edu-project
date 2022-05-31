import React, { FunctionComponent, useEffect, useState } from 'react';
import { Role } from '../../../../models/Role';
import AddedRolesListProps from './AddedRolesList.types';
import './AddedRolesList.css';

const AddedRolesList: FunctionComponent<AddedRolesListProps> = (
    props: AddedRolesListProps,
) => {
    const [roles, setRoles] = useState<Array<Role>>(props.roles);

    useEffect(() => {
        setRoles([...props.roles]);
    }, [props.roles]);

    return (
        <div className="Roleslist">
            {roles?.map((role: Role) => (
                <div className="listRow" key={role.id}>
                    <span>
                        {role.name}
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/3096/3096687.png"
                            alt="Add"
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
