## REACTABLE - A Reusable React Table Component

### How to use
Follow these steps to implement a reusable table component
1. Clone the repo from github
2. import TableContainer and Table Components from the table package in Components
3. Use the following implementation

#### Sample implementation
```
import React, { Component } from 'react';
import { TableContainer, Table } from 'components/table';

class App extends Component {
    render(){
        return(
            <div>
                <TableContainer>
                    <Table />
                </TableContainer>
            </div>
        )
    }
}
```
### More about its usage

#### TableContainer Component

The TableContainer Component defines the containment properties of the table.
The TableContainer Property takes a custom defined style props named tableContainerStyleProps
You may define any stylistic attributes you want to supply to the TableContainer and just set tableContainerStyleProps to your set object

#### Table Component

This is the main Table component and can be heavily customized.
The two most important props are cols and data props.
The cols props takes the column data, and the data props takes the overall data to be displayed in the table.
Please be sure to provide data for all the keys you have defined in cols in the data prop.
In case a data is missing for a key defined in col, it will show NA.
In case you have provided data for a key not defined in col, the value will not appear.
In case you do not provide col and data props, you will be displayed with a warning.

The rest of the props are style props, namely:
tableStyleProps, columnStyleProps, bodyStyleProps

tableStyleProps - Defines the style attributes of the overall table
columnStyleProps - Style attributes specific to the column
bodyStyleProps - Style attributes specific to the row


### An advanced Implementation

```
import React, { Component } from 'react';
import { TableContainer, Table } from 'components/table';

const cols = [
    {id: 'id', title: 'ID'},
    {id: 'name', title: 'Name'},
    {id: 'username', title: 'Username'},
];
const data = [
    {ID: '1', Name: 'Rohan', Username: 'deusexmachina892', _unique: 'ID'},
    {ID: '2', Name: 'Barry', Username: 'barry892', _unique: 'ID'},
    {ID: '3', Name: 'James', Username: 'james', _unique: 'ID'},
    {ID: '4', Name: 'Oliver', Username: 'oliver', _unique: 'ID'},
    {ID: '5', Name: 'Dipika', Username: 'dipika', _unique: 'ID'},
    {ID: '6', Name: 'Oliver', Username: 'oliver', _unique: 'ID'},
    {ID: '7', Name: 'Dipika', Username: 'dipika', _unique: 'ID'},
];

const tableContainerStyleProps = {
    margin: '5%',
    padding: '5%',
    color: '#787878',
    backgroundColor: 'black',
    border: '1px solid #787878',
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    verticalAlign: 'center'

};

const tableStyleProps = {
    display: 'flex', 
    flexFlow: 'column wrap', 
    justifyContent:'center'
};

const columnStyleProps = {
    backgroundColor: '#787878',
    color:'#fff',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center'
};

const bodyStyleProps = {
    backgroundColor: 'white'
};


class App extends Component {
    render(){
        return(
            <div>
                 <TableContainer
                    tableContainerStyleProps={tableContainerStyleProps}
                >
                    <Table
                        cols={cols}
                        data={data}
                        tableStyleProps={tableStyleProps}
                        columnStyleProps={columnStyleProps}
                        bodyStyleProps={bodyStyleProps}
                        pagination
                    />
                </TableContainer>
            </div>
        )
    }
}
```