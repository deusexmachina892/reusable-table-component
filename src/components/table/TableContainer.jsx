import React, { PureComponent } from 'react';


class TableContainer extends PureComponent{
    render(){
        const { 
            tableContainerStyleProps,
            children
        } = this.props;
        return(
            <section className='tableContainer' style={tableContainerStyleProps}>
                { children }
            </section>
        )
    }
}

export { TableContainer };