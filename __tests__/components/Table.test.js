import React from 'react';
import { shallow } from 'enzyme';

import { Table } from '../../src/components/table';

describe('Table Component', () => {
    const cols = [
        {id: 'id', title: 'ID'},
        {id: 'name', title: 'Name'},
        {id: 'username', title: 'Username'},
    ];
    const data = [
        {ID: 1, Name: 'Rohan', Username: 'deusexmachina892'},
        {ID: 2, Name: 'Barry', Username: 'barry892'},
        {ID: 3, Name: 'James', Username: 'james'},
        {ID: 4, Name: 'Oliver', Username: 'oliver'},
        {ID: 5, Name: 'Dipika', Username: 'dipika'},
    ]
    const wrapper = shallow(<Table 
                                cols={cols}
                                data={data}
                            />);
    
    const wrapperWithNoData = shallow(<Table 
                                    cols={cols}
                                    data={[]}
                                />)

    it ('renders correctly', () => {
      expect(wrapper.length).toBe(1);
  });
  
    // it has exactly one table element
    it('has exactly one table element', () => {
      expect(wrapper.find('table')).toHaveLength(1);
  });

    it('renders the columns correctly', () => {
        //it has exactly one thead element
        const thead = wrapper.find('thead');
        expect(thead).toHaveLength(1);

        // the number of th is equal to cols.length
        const headers = thead.find('th');
        expect(headers).toHaveLength(cols.length);

        // the th tag text is equal to column title
        headers.forEach((th, idx) => {
            expect(th.text()).toEqual(cols[idx].title);
        })
    });

    it('renders the rows correctly', () => {

        // it has exactly one tbody
        const tbody = wrapper.find('tbody');
        expect(tbody).toHaveLength(1);

        // number of rows is equal to data.length
        const rows = tbody.find('tr');
        expect(rows).toHaveLength(data.length);

        // Loop through each row anc check the text
        rows.forEach((tr, rowIndex) => {
            const cells = tr.find('td');
            expect(cells).toHaveLength(cols.length);
            // expect(cells.at(0).text()).toEqual(data[rowIndex].ID);
            expect(cells.at(1).text()).toEqual(data[rowIndex].Name);
            expect(cells.at(2).text()).toEqual(data[rowIndex].Username);
        });
       
    });

    it('renders tables with empty data correctly', () => {
    
    })

   

})
