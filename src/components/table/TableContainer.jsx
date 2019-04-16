import React, { Component } from 'react';


class TableContainer extends Component{
    render(){
        const { 
            tableStyleProps,
            children
        } = this.props;
        return(
            <section style={tableStyleProps}>
                { children }
            </section>
        )
    }
}

export { TableContainer };