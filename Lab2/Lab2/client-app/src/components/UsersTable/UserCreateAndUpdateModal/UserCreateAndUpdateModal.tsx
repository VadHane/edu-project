import React, {FunctionComponent, useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {Role} from '../../../models/Role';
import AddedRolesList from './AddedRolesList/AddedRolesList';
import AvailableRolesList from './AvailableRolesList/AvailableRolesList';
import UserCreateAndUpdateModalProps from './UserCreateAndUpdateModal.types';
import './UserCreateAndUpdateModal.css';
import {User} from '../../../models/User';

const UserCreateAndUpdateModal:
FunctionComponent<UserCreateAndUpdateModalProps> =
(props: UserCreateAndUpdateModalProps) => {
  const [firstName, setFirstName] = useState<string>(props.user.firstName);
  const [lastName, setLastName] = useState<string>(props.user.lastName);
  const [email, setEmail] = useState<string>(props.user.email);
  const [addedRoles, setAddedRoles] = useState<Array<Role>>(props.user.roles);
  const [availableRoles, setAvailableRoles] = useState<Array<Role>>([]);
  const [exceptionMessage, setExceptionMessage] = useState<string>('');
  const navigate = useNavigate();

  const file = React.createRef<HTMLInputElement>();

  useEffect(() => {
    props.getAllRolesAsync().then((roles: Array<Role>) =>
      setAvailableRoles([...roles]));
  }, []);

  useEffect(() => {
    setExceptionMessage('');
  }, [firstName, lastName, email]);

  const backgroundNode: React.ReactNode = (
    <NavLink to={'/'} title='Close modal window'>
      <div className="background"></div>
    </NavLink>
  );

  const exceptionString: React.ReactNode = (
    <div className='exceptionMessage'>
      <span>{exceptionMessage}</span>
    </div>
  );

  const modalWindowNode: React.ReactNode = (
    <div className="window">
      <form>
        <div className="formRows">
          <br/>
          {exceptionString}
          <input type="text"
            name='title'
            id='title'
            placeholder='First name'
            value={firstName}
            onChange={(event) => {
              setFirstName(event.target.value);
            }}/><br/>

          <input type="text"
            name='title'
            id='title'
            placeholder='Last name'
            value={lastName}
            onChange={(event) => {
              setLastName(event.target.value);
            }}/><br/>

          <input type="email"
            name='title'
            id='title'
            placeholder='email'
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}/><br/>

          <AddedRolesList
            roles={addedRoles}
            removeAddedRole={(role: Role) => addAvailableRole(role)} />

          <AvailableRolesList
            roles={availableRoles}
            addedRoles={addedRoles}
            addRole={(role: Role) => addRole(role)}
            createNewRole={(role: Role) => createNewRole(role)}/>

          <input type="file"
            accept='image/*'
            ref={file}/>
        </div>
      </form>
      <button onClick={() => createNewUser()}>
        {props.btnCaption}
      </button>
    </div>
  );

  const addRole = (role: Role): void => {
    setAvailableRoles((currentValue: Array<Role>) => {
      const indexOfSelectedRole = currentValue?.findIndex(
          (_role: Role) => _role.id === role.id);
      const prevList = currentValue.slice(0, indexOfSelectedRole);
      const endList = currentValue.slice(
          indexOfSelectedRole+1, currentValue.length);

      return [...prevList, ...endList];
    });
    setAddedRoles((currentValue) => [...currentValue, role]);
  };

  const addAvailableRole = (role: Role) => {
    setAddedRoles((currentValue: Array<Role>) => {
      const indexOfSelectedRole = currentValue?.findIndex(
          (_role: Role) => _role.id === role.id);
      const prevList = currentValue.slice(0, indexOfSelectedRole);
      const endList = currentValue.slice(
          indexOfSelectedRole+1, currentValue.length);

      return [...prevList, ...endList];
    });
    setAvailableRoles((currentValue) => [...currentValue, role]);
  };

  const createNewRole = (role: Role): void => {
    props.createNewRole(role).then((role: Role) => {
      setAvailableRoles((currentValue: Array<Role>) =>
        [...currentValue, role]);
    });
  };

  const validateInputFields = (): boolean => {
    if (firstName.trim().length < 3) {
      setExceptionMessage('Length of username can not be less than 3 symbols.');
      return false;
    }

    if (lastName.trim().length < 3) {
      setExceptionMessage('Length of surname can not be less than 3 symbols.');
      return false;
    }

    if (email.trim().length < 3) {
      setExceptionMessage('Length of email can not be less than 3 symbols.');
      return false;
    }

    const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!email.match(pattern)) {
      setExceptionMessage('Incorrect email.');
      return false;
    }

    if (file.current?.files?.item(0)?.type.split('/')[0] !== 'image') {
      setExceptionMessage('The file must be image.');
      return false;
    }

    return true;
  };

  const createNewUser = (): void => {
    if (!validateInputFields()) return;

    const newUser: User = {
      id: '',
      firstName: firstName,
      lastName: lastName,
      email: email,
      imageBlobKey: props.user.imageBlobKey,
      roles: addedRoles,
    };

    const userPhoto = file.current?.files?.item(0);

    props.resultActionAsync(newUser, userPhoto).then((done: Boolean) => {
      if (done) {
        navigate('/');
      } else {
        setExceptionMessage('Try again later.');
      }
    });
  };

  return (
    <div className="wrapper">
      {backgroundNode}
      {modalWindowNode}
    </div>
  );
};

export default UserCreateAndUpdateModal;
