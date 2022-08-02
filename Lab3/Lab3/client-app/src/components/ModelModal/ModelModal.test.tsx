import { render } from '@testing-library/react';
import React from 'react';
import ModelModal from './ModelModal';

jest.mock('../../hooks/useTypedSelector', () => ({
    ...jest.requireActual('../../hooks/useTypedSelector'),
    useTypedSelector: () => ({ tags: [], user: undefined }),
}));

jest.mock('./../../hooks/useTagActions', () => ({
    ...jest.requireActual('./../../hooks/useTagActions'),
    useTagActions: () => ({ getAllTags: jest.fn(), addNewTag: jest.fn() }),
}));

describe('Test modal window for models table.', () => {
    test('Snapshot', () => {
        const utils = render(
            <ModelModal
                resultButtonsCaption={'test'}
                open={true}
                onCloseModalHandler={() => jest.fn()}
                onSendFormHandler={() => jest.fn()}
            />,
        );

        expect(utils).toMatchSnapshot();
    });
});
