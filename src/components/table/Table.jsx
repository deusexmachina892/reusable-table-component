import React, { PureComponent } from 'react';
import styles from '../../assets/table.css';

class Table extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.data || null,
            selectedRows: []
        }
        this.renderColumns = this.renderColumns.bind(this);
        this.renderRows = this.renderRows.bind(this);
        this.handleColumnClick = this.handleColumnClick.bind(this);
    }
    renderColumns(){
        const { cols } = this.props;
        return cols.map( ({ id, title}) => {
            return(
                <th key={id} onClick={() => this.handleColumnClick(title)}>
                    {title}
                </th>
            )
        })
    }

    renderRows(gridTemplateColumns){
        const { data } = this.state;
        return data.map((row) => {
            const uniqueParam = row[row._unique]
            return(<tr 
                    key={uniqueParam}
                    className={this.state.selectedRows.includes(uniqueParam) && styles.selected}
                    style={{display: 'grid', gridTemplateColumns, width:'100%'}} 
                    onClick={() => this.selectRows(uniqueParam)}
                >
                {
                    Object.keys(row).map(rowKey => {
                        return rowKey !== '_unique' &&
                            (<td key={rowKey}>
                                {row[rowKey]}
                            </td>
                        )
                    })
                }
                
            </tr>)
        });
    }

    selectRows(rowUniqueKeyValue){
        const { selectedRows } = this.state;

        if (selectedRows.includes(rowUniqueKeyValue)){
            this.setState( { selectedRows: selectedRows.filter(item => item !== rowUniqueKeyValue)})
        } else {
            this.setState({ selectedRows: [...selectedRows, rowUniqueKeyValue]})
        }
    }

    handleColumnClick(sortingParameter){
        const { data } = this.state;
        let dataModified = data.sort((a, b) => a[sortingParameter] > b[sortingParameter]? 1: -1);
        this.setState({ data: [...dataModified]});
    }

    render(){
        console.log(this.state.selectedRows)
        const { cols, data, columnStyleProps } = this.props; 
        const gridTemplateColumns = Array(cols.length).fill('1fr').join(' ');
        return(
            <table style={{display: 'flex', flexFlow: 'column wrap', justifyContent:'center'}}>
                <thead  style={columnStyleProps}>
                    <tr style={{display: 'grid', gridTemplateColumns, width:'100%'}}>
                        {cols && this.renderColumns()}
                    </tr>
                </thead>
                <tbody>
                    {data && this.renderRows(gridTemplateColumns)}
                </tbody>
            </table>
        )
    }
}

export { Table };