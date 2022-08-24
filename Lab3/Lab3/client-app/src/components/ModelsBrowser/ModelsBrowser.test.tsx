import { render } from '@testing-library/react';
import React from 'react';
import ModelsBrowser from './ModelsBrowser';
import { ModelsBrowserProps } from './ModelsBrowser.types';

const props: ModelsBrowserProps = {
    models: [],
    isLoading: false,
};

jest.mock('./BrowsersRow', () => ({
    __esModule: true,
    default: () => <></>,
}));

describe('Test models browser.', () => {
    test('Snapshot', () => {
        const utils = render(<ModelsBrowser {...props} />);

        expect(utils).toMatchSnapshot();
    });
});
