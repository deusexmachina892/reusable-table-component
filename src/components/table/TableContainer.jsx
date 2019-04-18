import React, { Component } from 'react';


class TableContainer extends Component{
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