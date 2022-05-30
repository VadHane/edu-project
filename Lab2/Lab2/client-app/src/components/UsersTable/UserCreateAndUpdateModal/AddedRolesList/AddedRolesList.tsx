import React, {FunctionComponent, useEffect, useState} from 'react';
import {Role} from '../../../../models/Role';
import './AddedRolesList.css';

interface AddedRolesListProps {
    roles: Array<Role>,
    removeAddedRole: (role: Role) => void
}

const AddedRolesList: FunctionComponent<AddedRolesListProps> =
(props: AddedRolesListProps) => {
  const [roles, setRoles] = useState<Array<Role>>(props.roles);

  useEffect(() => {
    setRoles([...props.roles]);
  }, [props.roles.length]);

  return (
    <div className="Roleslist">
      {roles?.map((role: Role) => (
        <div className='listRow' key={role.id}>
          <span >
            {role.name}
            <img
              src="https://cdn-icons.flaticon.com/png/512/3031/premium/3031143.png?token=exp=1653673161~hmac=2e6de0cbe50df5048cc5778fdd464b40"
              alt="Add"
              onClick={() => props.removeAddedRole(role)}/>
          </span>
          <br />
        </div>
      ))}
    </div>
  );
};

export default AddedRolesList;
