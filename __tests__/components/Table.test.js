import React from 'react';
import { shallow } from 'enzyme';

import Table from '../../src/components/table/Table';

describe('Table Component', () => {
    const wrapper = shallow(<Table />)
  it ('renders correctly', () => {
      expect(wrapper.length).toBe(1);
  })
})
