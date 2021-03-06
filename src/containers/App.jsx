import React, { PureComponent, Fragment } from 'react';
import { TableContainer, Table, Pagination } from '../components/table';

const cols = [
    {id: 'id', title: 'ID'},
    {id: 'name', title: 'Name'},
    {id: 'username', title: 'Username'},
    {id: '_unique', keyId: 'id'}
];
const data = [
    {ID: '1', Name: 'Rohan', Username: 'deusexmachina892'},
    {ID: '2', Name: 'Barry', Username: 'barry892'},
    {ID: '3', Name: 'James', Username: 'james'},
    {ID: '4', Name: 'Oliver'},
    {ID: '5', Name: 'Dipika', Username: 'dipika'},
    {ID: '6', Name: 'Oliver', Username: 'oliver'},
    {ID: '7', Name: 'Dipika', Username: 'dipika'},
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
class App extends PureComponent{
    render(){
        return(
            <Fragment>
                <h2>Reusable React Table</h2>
                <p>Go to
                    &nbsp;
                    <a 
                        href='https://github.com/deusexmachina892/reusable-table-component'
                        target='blank'
                        rel='no-referrer'
                    >
                        Github
                    </a>
                    &nbsp;
                    to read about the documentation and learn about the usage</p>
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
            </Fragment>
        )
    }
}

export default App;