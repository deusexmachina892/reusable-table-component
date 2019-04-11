import React, { PureComponent, Fragment } from 'react';
import Table from '../components/table/Table';

class App extends PureComponent{
    render(){
        return(
            <Fragment>
                <Table>
                    Hello
                </Table>
            </Fragment>
        )
    }
}

export default App;