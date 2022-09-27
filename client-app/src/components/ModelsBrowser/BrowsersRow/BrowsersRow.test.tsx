import { Table, TableBody } from '@mui/material';
import { render } from '@testing-library/react';
import React from 'react';
import { Model } from '../../../models/Model';
import { User } from '../../../models/User';
import BrowsersRow from './BrowsersRow';

const user: User = {
    id: '',
    firstName: 'TestUsername',
    lastName: 'TestSurname',
    email: '',
    password: '',
    imageBlobKey: null,
    roles: [],
    isAdmin: false,
};
const signedUrl = 'testSignedUrl';
const model: Model = {
    id: '',
    name: '',
    filekey: '',
    prevBlobKey: '',
    description: '',
    createdAt: new Date(),
    createdBy: '',
    updatedAt: new Date(),
    updatedBy: '',
    tags: [],
    modelHistory: [],
};

jest.mock('../../../services/userService', () => ({
    ...jest.requireActual('../../../services/userService'),
    getUserByIdAsync: () => new Promise(() => user),
}));

jest.mock('../../../services/fileService', () => ({
    ...jest.requireActual('../../../services/fileService'),
    signUrl: () => new Promise(() => signedUrl),
}));

jest.mock('../../ModalImage', () => ({
    __esModule: true,
    default: () => <></>,
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Test row of models browser.', () => {
    test('Snapshot', () => {
        const utils = render(
            <Table>
                <TableBody>
                    <BrowsersRow model={model} />
                </TableBody>
            </Table>,
        );

        expect(utils).toMatchSnapshot();
    });
});
