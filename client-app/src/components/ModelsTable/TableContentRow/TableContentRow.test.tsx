import { render } from '@testing-library/react';
import React from 'react';
import { Model } from '../../../models/Model';
import TableContentRow from './TableContentRow';

jest.mock('./../../../hooks/useModelActions', () => ({
    ...jest.requireActual('./../../../hooks/useModelActions'),
    useModelActions: () => ({ deleteModel: jest.fn() }),
}));

const emptyModel: Model = {
    id: '',
    name: '',
    filekey: '',
    prevBlobKey: '',
    description: '',
    createdAt: new Date('1995-12-17T03:24:00'),
    createdBy: '',
    updatedAt: new Date('1995-12-17T03:24:00'),
    updatedBy: '',
    tags: [],
    modelHistory: [],
};

describe('Test tables content row.', () => {
    test('Snapshot', () => {
        const utils = render(
            <table>
                <tbody>
                    <TableContentRow
                        model={emptyModel}
                        onEditModelHandler={() => jest.fn()}
                    />
                </tbody>
            </table>,
        );

        expect(utils).toMatchSnapshot();
    });
});
