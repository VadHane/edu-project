import { render } from '@testing-library/react';
import React from 'react';
import PageNotFound from './PageNotFound';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Test page not found component.', () => {
    test('Snapshot', () => {
        const utils = render(<PageNotFound />);

        expect(utils).toMatchSnapshot();
    });
});
