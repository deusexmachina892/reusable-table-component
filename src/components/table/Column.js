import React, { PureComponent, Fragment } from 'react';

class Column extends PureComponent {
    renderData() {
        const { data } = this.props;
        console.log(data)
        return data.map(({ id, title }) => {
            return (
                <td key={id}> {title} </td>
            )
        });
    }

    render(){
        return(
            <Fragment>
                <thead>
                    {this.props.data && this.renderData()}
                </thead>
            </Fragment>
        )
    }
}

export { Column };
