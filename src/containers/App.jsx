import React, { PureComponent, Fragment } from 'react';
import { Table, Column, Body } from '../components/table';

class App extends PureComponent{
    render(){
        return(
            <Fragment>
                <Table>
                    <Column
                        data={[
                            { id: 'serial_no', title: 'Serial No.'},
                            { id: 'name',  title: 'Name'}
                        ]}
                    />
                    <Body
                        data={[
                            { serial_no: 1, name: 'Rohan' }
                        ]}
                    />
                </Table>
            </Fragment>
        )
    }
}

export default App;