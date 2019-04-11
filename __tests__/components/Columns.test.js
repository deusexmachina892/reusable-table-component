import React from 'react';
import { shallow } from 'enzyme';

// Component to test
import { Column } from '../../src/components/table';

describe('Column Component', () => {
    const wrapper = shallow(<Column />);
    const wrapperWithProps = shallow(
                                <Column data={[
                                    {id: 'serial', title: 'Serial #'}
                                ]}/>
                                )
    it('renders correctly', () => {
        expect(wrapper.length).toBe(1);
    });

    it('renders one <thead />', () => {
       expect(wrapper.find('thead')).toHaveLength(1);
    });

    it('renders the props correctly', () => {
        expect(wrapperWithProps.find('thead').children()).toHaveLength(1);
    });
});

