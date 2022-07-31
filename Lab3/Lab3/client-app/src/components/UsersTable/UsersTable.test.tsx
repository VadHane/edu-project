import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import UsersTable from './UsersTable';
import { User } from '../../models/User';
import {
    ACTIONS_COLUMN_HEADER,
    EMAIL_COLUMN_HEADER,
    FIRST_NAME_COLUMN_HEADER,
    LAST_NAME_COLUMN_HEADER,
    PICTURE_COLUMN_HEADER,
    ROLES_COLUMN_HEADER,
} from './UsersTable.constants';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Routes: jest.fn(),
}));

jest.mock('../../hooks/useTypedSelector', () => ({
    ...jest.requireActual('../../hooks/useTypedSelector'),
    useTypedSelector: () => ({ users: [] }),
}));

jest.mock('../../hooks/useUserActions', () => ({
    useUserActions: () => ({ getAllUsers: mockedGetAllUsersAsync }),
}));

jest.mock('./TableContentRow');
jest.mock('../AddUserButton');
jest.mock('../WarningModal');

const mockedGetAllUsersAsync = jest.fn();

const mockedCreateNewRole = jest.fn();
const mockedCreateUserAsync = jest.fn();
const mockedEditUserAsync = jest.fn();
const mockedDeleteUserAsync = jest.fn();

describe('Test users table.', () => {
    beforeEach(() => {
        mockedGetAllUsersAsync.mockReturnValue(new Promise<Array<User>>(() => []));
        // mocked.mockReturnValue((Component) => (props) => <Component {...props} />);
    });

    afterEach(cleanup);

    test('Component shuld render without errors.', () => {
        render(<UsersTable />);

        expect(
            screen.getByRole('columnheader', { name: PICTURE_COLUMN_HEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: FIRST_NAME_COLUMN_HEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: LAST_NAME_COLUMN_HEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: EMAIL_COLUMN_HEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: ROLES_COLUMN_HEADER }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole('columnheader', { name: ACTIONS_COLUMN_HEADER }),
        ).toBeInTheDocument();
    });

    test('Snapshot.', () => {
        const utils = render(<UsersTable />);

        expect(utils).toMatchSnapshot();
    });
});
