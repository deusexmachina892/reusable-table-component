import React, { PureComponent, Fragment } from 'react';
import fuzzysort from 'fuzzysort';

import Pagination from './Pagination';
import '../../assets/table.css';


class Table extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.data || null,
            selectedRows: [],
            rowsPerPage: this.props.data.length < 20?
                            this.props.data.length:20,
            currentPage: 1
        }
       
        this.renderColumns = this.renderColumns.bind(this);
        this.renderRows = this.renderRows.bind(this);
        this.handleColumnClick = this.handleColumnClick.bind(this);
        this.handleRowNumberChange = this.handleRowNumberChange.bind(this);
        this.resetRowState = this.resetRowState.bind(this);
        this.checkRowStateOnBlur = this.checkRowStateOnBlur.bind(this);
        this.handlePageDisplay = this.handlePageDisplay.bind(this)
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
        const { data, currentPage , rowsPerPage} = this.state;

        // startingIndex depending on selected page
        const startingIndex = rowsPerPage * (currentPage -1);

        // Ending index depending on selected page
        const endingIndex = rowsPerPage * currentPage;
        const rows = data.slice(startingIndex, endingIndex);
        return rows.map((row) => {
            const uniqueParam = row[row._unique]
            return(<tr 
                    key={uniqueParam}
                    className={ this.state.selectedRows.includes(uniqueParam)? 'selectedRow': ''}
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

    handleRowNumberChange(e){
        // console.log(e.target.value);
        const rowsPerPage = e.target.value;
        console.log(rowsPerPage)
        const { data } = this.state;

        if ((Number(rowsPerPage) >0 && Number(rowsPerPage) <= data.length)|| rowsPerPage == '') {
            this.setState({rowsPerPage});
        }
       
    }

    resetRowState(){
        this.setState({ rowsPerPage: ''})
    }

    checkRowStateOnBlur(){
        if(!this.state.rowsPerPage){
            this.setState({ rowsPerPage: this.props.data.length < 20?
                                         this.props.data.length:20})
        }
    }
    
    handlePageDisplay(page){
        this.setState({ currentPage: page})
    }

    filterData(e){
        let data;
        const { cols } = this.props;
        const keys = cols.map(item => item.title);

        if(e.target.value) {
            data = fuzzysort.go(e.target.value, this.props.data, {keys})
            data = data.map(item => item.obj)
        } else {
            data = this.props.data;
        }
       
       this.setState({ data, rowsPerPage: data.length <20? data.length : 20 })
    }
    render(){
        const { data, rowsPerPage } = this.state;
        const { 
            cols,
            tableStyleProps,
            columnStyleProps,
            bodyStyleProps,
            pagination
        } = this.props; 
        const gridTemplateColumns = Array(cols.length).fill('1fr').join(' ');
        return(
            <Fragment>
                <div>
                    <span>Apply Action: </span>
                    <span>
                        <label>Filter By:</label>
                        <input 
                            placeholder={'Enter Search Term'}
                            onChange={(e) => this.filterData(e)}
                        />
                    </span>
                </div>
                 <table style={tableStyleProps}>
                    <thead  style={columnStyleProps}>
                        <tr style={{display: 'grid', gridTemplateColumns, width:'100%'}}>
                            {cols && this.renderColumns()}
                        </tr>
                    </thead>
                    <tbody style={bodyStyleProps}>
                        {data && this.renderRows(gridTemplateColumns)}
                    </tbody>
                </table>
                {pagination && <Pagination
                                rowsPerPage={rowsPerPage} 
                                length={data.length}
                                handleRowNumberChange={this.handleRowNumberChange}
                                resetRowState={this.resetRowState}
                                checkRowStateOnBlur={this.checkRowStateOnBlur}
                                handlePageDisplay ={this.handlePageDisplay}
                                />}
            </Fragment>
        )
    }
}

export { Table };