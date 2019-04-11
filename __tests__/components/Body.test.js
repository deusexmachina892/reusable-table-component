import React from 'react';
import { shallow } from 'enzyme';

// Component to test
import { Body } from '../../src/components/table';

describe('Body Component', () => {
    const wrapper = shallow(<Body />);
    it('renders correctly', () => {
        expect(wrapper.length).toBe(1);
    });
});
