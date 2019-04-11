import React from 'react';
import { shallow } from 'enzyme';

// Component to Test
import App from '../src/containers/App';

// Children
import Table from '..//src/components/table/Table';

describe('App Container', () => {
  const wrapper = shallow(<App />);
    it('renders correctly', () => {
        expect(wrapper.length).toBe(1);
  });

    it('renders a Table Component', () => {
        console.log(wrapper.contains(Table))
       // expect(wrapper.find(Table)).to.have.lengthOf(1);
    })
})
