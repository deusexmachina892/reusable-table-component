import React, { PureComponent } from 'react';

class Table extends PureComponent{
    render(){
        const { height, width, children } = this.props; 
        return(
            <table 
                className='tableCustom' 
                style={ 
                    {
                        height: `${height || 100}px` , 
                        width: `${width || 100}px`
                    }
                }>
                { children }
            </table>
        )
    }
}

export default Table;