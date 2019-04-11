import React from 'react';
import { shallow } from 'enzyme';

// Component to test
import { Column } from '../../src/components/table';

describe('Column Component', () => {
    const wrapper = shallow(<Column />)
    it('renders correctly', () => {
        expect(wrapper.length).toBe(1);
    });
});

