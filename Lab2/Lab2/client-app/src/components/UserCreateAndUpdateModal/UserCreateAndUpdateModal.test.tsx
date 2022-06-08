import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import {
    FILE_NOT_IMAGE_EXCEPTION,
    INCORECT_USER_ID_EXCEPTION,
    INCORRECT_EMAIL_EXCEPTION,
    LENGTH_OF_NAME_EXCEPTION,
    LENGTH_OF_SURNAME_EXCEPTION,
} from '../../App.constants';
import { Role } from '../../models/Role';
import { User } from '../../models/User';
import UserCreateAndUpdateModal from './UserCreateAndUpdateModal';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => jest.fn(),
    useParams: () => jest.fn(),
    NavLink: jest.fn(() => <></>),
}));

jest.mock('./AddedRolesList');
jest.mock('./AvailableRolesList');

const testButtonCaption = 'test';
const testRolesList: Array<Role> = [
    {
        id: '1',
        name: 'test1',
    },
];
const testUser: User = {
    id: '1234',
    firstName: 'TestName',
    lastName: 'TestSurname',
    email: 'email@gmail.com',
    imageBlobKey: '/',
    roles: [],
};
const testEmptyUser: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    imageBlobKey: null,
    roles: [],
};

const mockedGetAllRoles = jest.fn();
const mockedGetUserById = jest.fn();
const mockedCreateNewRole = jest.fn();
const mockedResultActionAsync = jest.fn();

const testModalWindowNode = (
    <UserCreateAndUpdateModal
        buttonContent={testButtonCaption}
        getAllRolesAsync={mockedGetAllRoles}
        getUserById={mockedGetUserById}
        createNewRole={mockedCreateNewRole}
        resultActionAsync={mockedResultActionAsync}
    />
);

describe('Test create/update modal window.', () => {
    beforeEach(() => {
        mockedGetUserById.mockReturnValue(testUser);
        mockedGetAllRoles.mockReturnValue(new Promise<Array<Role>>(() => testRolesList));
    });

    afterEach(cleanup);

    test('Component should render without errors.', () => {
        render(<>{testModalWindowNode}</>);

        expect(screen.getAllByRole('textbox').length).toBe(3);
        expect(
            screen.getByRole('button', { name: testButtonCaption }),
        ).toBeInTheDocument();
    });

    test('Component should render correct without data.', () => {
        const emptySting = '';

        render(
            <UserCreateAndUpdateModal
                buttonContent={emptySting}
                getAllRolesAsync={mockedGetAllRoles}
                getUserById={mockedGetUserById}
                createNewRole={mockedCreateNewRole}
                resultActionAsync={mockedResultActionAsync}
            />,
        );

        expect(screen.getAllByRole('textbox').length).toBe(3);
        expect(screen.getByRole('button', { name: emptySting })).toBeInTheDocument();
    });

    test('Component renders warning window, if getUserById returns undefined.', () => {
        mockedGetUserById.mockReturnValue(undefined);

        render(<>{testModalWindowNode}</>);

        expect(screen.queryAllByRole('textbox').length).toBe(0);
        expect(screen.queryByRole('button', { name: testButtonCaption })).toBeNull();
        expect(screen.getByText(INCORECT_USER_ID_EXCEPTION)).toBeInTheDocument();
    });

    test('When you click the "Approve" button, the component should contain a warning message if the name field is empty.', () => {
        mockedGetUserById.mockReturnValue(testEmptyUser);
        render(<>{testModalWindowNode}</>);

        fireEvent.click(screen.getByRole('button', { name: testButtonCaption }));

        expect(screen.getByText(LENGTH_OF_NAME_EXCEPTION)).toBeInTheDocument();
        expect(mockedResultActionAsync).toBeCalledTimes(0);
    });

    test('When you click the "Approve" button, the component should contain a warning message if the surname field is empty.', () => {
        const testInputName = 'test';

        mockedGetUserById.mockReturnValue(testEmptyUser);
        render(<>{testModalWindowNode}</>);

        fireEvent.change(screen.getAllByRole('textbox')[0], {
            target: { value: testInputName },
        });
        fireEvent.click(screen.getByRole('button', { name: testButtonCaption }));

        expect(screen.getByText(LENGTH_OF_SURNAME_EXCEPTION)).toBeInTheDocument();
        expect(mockedResultActionAsync).toBeCalledTimes(0);
    });

    test('When you click the "Approve" button, the component should contain a warning message if the email field is empty or incorrect.', () => {
        const testInputName = 'test';
        const testInputSurname = 'test';

        mockedGetUserById.mockReturnValue(testEmptyUser);
        render(<>{testModalWindowNode}</>);

        fireEvent.change(screen.getAllByRole('textbox')[0], {
            target: { value: testInputName },
        });
        fireEvent.change(screen.getAllByRole('textbox')[1], {
            target: { value: testInputSurname },
        });

        fireEvent.click(screen.getByRole('button', { name: testButtonCaption }));

        expect(screen.getByText(INCORRECT_EMAIL_EXCEPTION)).toBeInTheDocument();
        expect(mockedResultActionAsync).toBeCalledTimes(0);
    });

    test('When you click the "Approve" button, the component should contain a warning message if the file field is empty or file is not a image.', () => {
        const testInputName = 'test';
        const testInputSurname = 'test';
        const testEmail = 'test@test.ts';

        mockedGetUserById.mockReturnValue(testEmptyUser);
        render(<>{testModalWindowNode}</>);

        fireEvent.change(screen.getAllByRole('textbox')[0], {
            target: { value: testInputName },
        });
        fireEvent.change(screen.getAllByRole('textbox')[1], {
            target: { value: testInputSurname },
        });
        fireEvent.change(screen.getAllByRole('textbox')[2], {
            target: { value: testEmail },
        });

        fireEvent.click(screen.getByRole('button', { name: testButtonCaption }));

        expect(screen.getByText(FILE_NOT_IMAGE_EXCEPTION)).toBeInTheDocument();
        expect(mockedResultActionAsync).toBeCalledTimes(0);
    });

    test('Snapshot.', () => {
        const utils = render(<>{testModalWindowNode}</>);

        expect(utils).toMatchSnapshot();
    });
});
