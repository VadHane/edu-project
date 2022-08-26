import { render } from '@testing-library/react';
import React from 'react';
import ModelsTable from './ModelsTable';

jest.mock('../../hooks/useTypedSelector', () => ({
    ...jest.requireActual('../../hooks/useTypedSelector'),
    useTypedSelector: () => ({ models: [] }),
}));

describe('Test models table.', () => {
    test('Snapshot', () => {
        const utils = render(
            <ModelsTable
                onAddModelHandler={() => jest.fn()}
                onEditModelHandler={() => jest.fn()}
            />,
        );

        expect(utils).toMatchSnapshot();
    });
});
