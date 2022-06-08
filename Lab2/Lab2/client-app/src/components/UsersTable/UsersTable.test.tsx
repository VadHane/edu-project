import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import UsersTable from './UsersTable';
import { User } from '../../models/User';
import {
    ACTIONS_COLUMNHEADER,
    EMAIL_COLUMNHEADER,
    FIRST_NAME_COLUMNHEADER,
    LAST_NAME_COLUMNHEADER,
    PICTURE_COLUMNHEADER,
    ROLES_COLUMNHEADER,
} from './UsersTable.constants';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    Routes: jest.fn(),
}));

jest.mock('./TableContentRow');
jest.mock('../UserCreateAndUpdateModal');
jest.mock('../AddUserButton');
jest.mock('../UserWarningModal');

const mockedGetAllUsersAsync = jest.fn();
const mockedGetAllRolesAsync = jest.fn();
const mockedCreateNewRole = jest.fn();
const mockedCreateUserAsync = jest.fn();
const mockedEditUserAsync = jest.fn();
const mockedDeleteUserAsync = jest.fn();

const UsersTableNode: React.ReactNode = (
    <UsersTable
        getAllUsersAsync={mockedGetAllUsersAsync}
        getAllRolesAsync={mockedGetAllRolesAsync}
        createNewRole={mockedCreateNewRole}
        createUserAsync={mockedCreateUserAsync}
        editUserAsync={mockedEditUserAsync}
        deleteUserAsync={mockedDeleteUserAsync}
    />
);

describe('Test users table.', () => {
    beforeEach(() => {
        mockedGetAllUsersAsync.mockReturnValue(new Promise<Array<User>>(() => []));
    });

    afterEach(cleanup);

    test('Component shuld render without errors.', () => {
        render(<>{UsersTableNode}</>);

        expect(
            screen.getByRole('columnheader', { name: PICTURE_COLUMNHEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: FIRST_NAME_COLUMNHEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: LAST_NAME_COLUMNHEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: EMAIL_COLUMNHEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: ROLES_COLUMNHEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: ACTIONS_COLUMNHEADER }),
        ).toBeInTheDocument();
    });

    test('Snapshot.', () => {
        const utils = render(<>{UsersTableNode}</>);

        expect(utils).toMatchSnapshot();
    });
});
