import React, { PureComponent, Fragment } from 'react';
import { TableContainer, Table } from '../components/table';

const cols = [
    {id: 'id', title: 'ID'},
    {id: 'name', title: 'Name'},
    {id: 'username', title: 'Username'},
];
const data = [
    {ID: 1, Name: 'Rohan', Username: 'deusexmachina892', _unique: 'ID'},
    {ID: 2, Name: 'Barry', Username: 'barry892', _unique: 'ID'},
    {ID: 3, Name: 'James', Username: 'james', _unique: 'ID'},
    {ID: 4, Name: 'Oliver', Username: 'oliver', _unique: 'ID'},
    {ID: 5, Name: 'Dipika', Username: 'dipika', _unique: 'ID'},
];

const tableStyleProps = {
    margin: 'auto',
    padding: '10px',
    color: '#787878',
    border: '1px solid #787878',
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center'

}

const columnStyleProps = {
    backgroundColor: '#787878',
    color:'#fff',
    display: 'flex',
    flexFlow: 'row wrap',
    justifyContent: 'center'
}
class App extends PureComponent{
    render(){
        return(
            <Fragment>
                <TableContainer
                    tableStyleProps={tableStyleProps}
                >
                    <Table
                        cols={cols}
                        data={data}
                        columnStyleProps={columnStyleProps}
                    />
                </TableContainer>
            </Fragment>
        )
    }
}

export default App;