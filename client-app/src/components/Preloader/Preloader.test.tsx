import { render } from '@testing-library/react';
import React from 'react';
import Preloader from './Preloader';

describe('Test modal window for login.', () => {
    test('Snapshot', () => {
        const utils = render(<Preloader />);

        expect(utils).toMatchSnapshot();
    });
});
