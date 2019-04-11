import React from 'react';
import { shallow } from 'enzyme';

import { Table } from '../../src/components/table';

describe('Table Component', () => {
    const wrapper = shallow(<Table />)
    const wrapperWithProps = shallow(<Table 
                                        height={30} 
                                        width={30} 
                                    />)
  it ('renders correctly', () => {
      expect(wrapper.length).toBe(1);
  });

  it('has the proper height and width as mentioned in the props', () => {
      expect(wrapperWithProps.prop('style')).toEqual({height: '30px', width: '30px'});
  });
})
