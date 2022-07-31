import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import TableContentRow from './TableContentRow';
import { User } from '../../../models/User';
import { REMOVE_IMAGE } from '../../../App.constants';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => jest.fn(),
}));

jest.mock('../../../hooks/useUserActions');

const defaultUser: User = {
    id: '1234',
    firstName: 'TestName',
    lastName: 'TestSurname',
    email: 'email@gmail.com',
    imageBlobKey: '/',
    roles: [],
};

const mockedDelete = jest.fn();

describe('Test for table content row.', () => {
    afterEach(cleanup);

    test('Correct render.', () => {
        render(
            <table>
                <tbody>
                    <TableContentRow user={defaultUser} />
                </tbody>
            </table>,
        );

        expect(screen.getByText(defaultUser.firstName)).toBeInTheDocument();
    });

    test('Correct click action for delete/edit icons.', () => {
        render(
            <table>
                <tbody>
                    <TableContentRow user={defaultUser} />
                </tbody>
            </table>,
        );

        fireEvent.click(screen.getByAltText(REMOVE_IMAGE.ALT));

        expect(mockedDelete).toHaveBeenCalledTimes(1);
    });

    test('Snapshot.', () => {
        const contentRow = render(
            <table>
                <tbody>
                    <TableContentRow user={defaultUser} />
                </tbody>
            </table>,
        ).container;

        expect(contentRow).toMatchSnapshot();
    });

    test('Snapshot without data.', () => {
        const emptyUser: User = {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            imageBlobKey: '',
            roles: [],
        };
        const contentRow = render(
            <table>
                <tbody>
                    <TableContentRow user={emptyUser} />
                </tbody>
            </table>,
        ).container;

        expect(contentRow).toMatchSnapshot();
    });
});
