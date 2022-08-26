import React from 'react';
import { render } from '@testing-library/react';
import TableContentRow from './TableContentRow';
import { User } from '../../../models/User';

jest.mock('react-router-dom', () => ({
    ...(jest.requireActual('react-router-dom') as any),
    useNavigate: () => jest.fn(),
}));

jest.mock('../../../hooks/useUserActions');

describe('Test for table content row.', () => {
    test('Snapshot.', () => {
        const emptyUser: User = {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            imageBlobKey: '',
            roles: [],
            password: '',
            isAdmin: false,
        };
        const contentRow = render(
            <table>
                <tbody>
                    <TableContentRow user={emptyUser} onEditHandler={jest.fn()} />
                </tbody>
            </table>,
        ).container;

        expect(contentRow).toMatchSnapshot();
    });
});
