import React, { PureComponent, Fragment } from 'react';
import fuzzysort from 'fuzzysort';
import mapKeys from 'lodash.mapkeys';

import Pagination from './Pagination';
import '../../assets/table.css';

class Table extends PureComponent{
    constructor(props){
        super(props);
        this.state = {
            data: this.props.data || null,
            selectedRows: [],
            rowsPerPage: this.props.data && (this.props.data.length < 20?
                            this.props.data.length:20) || null,
            currentPage: 1,
            colTitles: [],
            editingRowIndex: null,
            _uniqueRowKey: null
        };

        this._defaultTableStyleProps = {
            display: 'flex', 
            flexFlow: 'column wrap', 
            justifyContent:'center'
        };

        this._defaultColStyleProps = {
            backgroundColor: '#787878',
            color:'#fff',
            display: 'flex',
            flexFlow: 'row wrap',
            justifyContent: 'center'
        };

        this._defaultBodyStyleProps = {
            backgroundColor: 'white'
        };
        this.renderColumns = this.renderColumns.bind(this);
        this.renderRows = this.renderRows.bind(this);
        this.handleColumnClick = this.handleColumnClick.bind(this);
        this.handleRowNumberChange = this.handleRowNumberChange.bind(this);
        this.resetRowState = this.resetRowState.bind(this);
        this.checkRowStateOnBlur = this.checkRowStateOnBlur.bind(this);
        this.handlePageDisplay = this.handlePageDisplay.bind(this);
    }


    componentDidMount() {
        const colsWithKeys = mapKeys(this.props.cols, 'id');
        const colTitles = Object.keys(colsWithKeys).reduce((acc, ck) => {
            if (ck !== '_unique'){
                acc.push(colsWithKeys[ck].title);
            }
            return acc;
        }, [])
  
        const uniqueRowKey = colsWithKeys[colsWithKeys._unique.keyId].title;
        this.setState({
            colTitles,
            rowsPerPage:  this.state.data && (this.state.data.length < 20?
                            this.state.data.length:20),
            _uniqueRowKey: uniqueRowKey
        });
    }
    componentDidUpdate(prevProps, prevState){
        if(prevState.data.length !== this.state.data.length){
            const { currentPage, rowsPerPage, data } = this.state;
            const rowsPerPageNo = Number(rowsPerPage);
                if( data.length % rowsPerPageNo === 0 && Number(currentPage) > (data.length/rowsPerPageNo)){
                    this.setState({
                        currentPage: (data.length/rowsPerPageNo)
                    })
                }
        }
    }

    // column renderer
    renderColumns(){
        const { cols } = this.props;
        return cols.map( ({ id, title}) => {
            return(
                id !== '_unique' &&
                <th key={id} onClick={() => this.handleColumnClick(title)}>
                    {title}
                </th>
            )
        })
    }

    // row renderer
    renderRows(gridTemplateColumns){
        const { data, currentPage , rowsPerPage, colTitles, _uniqueRowKey } = this.state; 
        // startingIndex depending on selected page
        const startingIndex = rowsPerPage * (currentPage -1);
        // Ending index depending on selected page
        const endingIndex = rowsPerPage * currentPage;
        const rows = data.slice(startingIndex, endingIndex);
        return rows.map((row) => {
            const uniqueParam = row[_uniqueRowKey];
            const rowIndex = this.state.data.indexOf(row);
            return(uniqueParam && <tr 
                    key={uniqueParam}
                    className={ this.state.selectedRows.includes(uniqueParam)? 'selectedRow': ''}
                    style={{display: 'grid', gridTemplateColumns: `0.25fr ${gridTemplateColumns} 0.25fr 0.25fr`, width:'100%'}} 
                >
                    <td><input type='checkbox' onClick={()=> this.handleRowCheckBoxClick(row, uniqueParam)}/></td>
                { 
                    colTitles.map(key => {
                        // console.log(key)
                        // console.log(row)
                        return(
                            <td key={key}>
                                {  this.state.editingRowIndex === rowIndex?
                                    <input 
                                        type='text'
                                        placeholder={this.state.data[rowIndex][key]}
                                        onChange={(e) => this.handleRowEdit(e, row, key, rowIndex)}
                                        style={{width: '100%', height: '100%'}}
                                        />:
                                <div>{row[key] || 'NA'}</div>}
                            </td>
                        );
                    })
                }
                <td onClick={() => this.toggleEdit(rowIndex)}>
                    {this.state.editingRowIndex !== null && this.state.editingRowIndex === rowIndex?
                        <i className="fas fa-check" style={{color: 'green'}}></i>
                        :<i className="far fa-edit"></i>
                    }
                </td>
                <td onClick={() => this.handleRowDelete(row, rowIndex)}>
                    <i className="far fa-trash-alt"></i>
                </td>
                
            </tr>)
        });
    }

    // method for selecting rows
    selectRows(rowUniqueKeyValue){
        const { selectedRows } = this.state;
        if (selectedRows.includes(rowUniqueKeyValue)){
            this.setState( { selectedRows: selectedRows.filter(item => item !== rowUniqueKeyValue)})
        } else {
            this.setState({ selectedRows: [...selectedRows, rowUniqueKeyValue]})
        }
    }

    // method for sorting on column click
    handleColumnClick(sortingParameter){
        const { data } = this.state;
        let dataModified = data.sort((a, b) => a[sortingParameter] > b[sortingParameter]? 1: -1);
        this.setState({ data: [...dataModified]});
    }

    // method for handling number of rows per page in the pagination
    handleRowNumberChange(e){
        // console.log(e.target.value);
        const rowsPerPage = e.target.value;
        const { data } = this.state;

        if ((Number(rowsPerPage) >0 && Number(rowsPerPage) <= data.length)|| rowsPerPage == '') {
            this.setState({rowsPerPage});
        }
       
    }

    // method to reset Row State
    resetRowState(){
        this.setState({ rowsPerPage: ''})
    }

    // method to check row state when input is done with
    checkRowStateOnBlur(){
        if(!this.state.rowsPerPage){
            this.setState({ rowsPerPage: this.props.data.length < 20?
                                         this.props.data.length:20})
        }
    }
    
    // method to handle the current page display
    handlePageDisplay(page){
        this.setState({ currentPage: page})
    }

    // method for filtering
    filterData(e){
        let data;
        const { colTitles } = this.state;
        const keys = colTitles;

        if(e.target.value) {
            data = fuzzysort.go(e.target.value, this.props.data, {keys})
            data = data.map(item => item.obj)
        } else {
            data = this.props.data;
        }
       
       this.setState({ data, rowsPerPage: data.length <20? data.length : 20 })
    }

    // method to handle column check box click for multiple selection
    handleColumnCheckboxClick(){
       
    }

    // method for inserting new row
   handleRowInsert(){
       const { colTitles, _uniqueRowKey, data } = this.state;
       const defaultRow = colTitles.reduce((acc, cv) => {
            acc[cv] = '';
            return acc;
       }, {});
       defaultRow['_unique'] = _uniqueRowKey;
       const uniqueKey = _uniqueRowKey;
       defaultRow[uniqueKey] = data.length + 1;

       this.setState({ data: [
           ...data,
           defaultRow
       ]});
   }
   
   // toggle edit handler
   toggleEdit(rowIndex){
       let editingRowIndex;
       if(this.state.editingRowIndex === rowIndex){
            editingRowIndex = null;
       } else {
           editingRowIndex = rowIndex
       }
        this.setState({
            editingRowIndex
        })
    }

    // row edit handler
    handleRowEdit(e, row, key, rowIndex){
        const data = this.state.data;
        if(e.target.value){
            data[rowIndex][key] = e.target.value;
        }
        
        this.setState({data});
    }

    // row delete handler
    handleRowDelete(row){
        const { currentPage, rowsPerPage } = this.state;
        const data = this.state.data.filter(item => item !== row);
      //  if
        this.setState({data});

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
        const gridTemplateColumns = Array(cols && cols.length - 1).fill('1fr').join(' ');
        return(
            <Fragment>
                <div>
                    <span>
                        Add Row &nbsp;
                        <button className='addRowBtn' onClick={() => this.handleRowInsert()}>
                        <i className="fas fa-plus"></i>
                        </button>
                    </span>
                    <span>
                        <label>Filter By:</label>
                        <input 
                            placeholder={'Enter Search Term'}
                            onChange={(e) => this.filterData(e)}
                        />
                    </span>
                </div>
               
                {cols && cols.length > 0?
                <section 
                    className='table-responsive-container' 
                    style={{backgroundColor: tableStyleProps.backgroundColor || this._defaultTableStyleProps.backgroundColor}}>
                        <table style={tableStyleProps || this._defaultTableStyleProps}>
                            <thead  style={columnStyleProps || this._defaultColStyleProps}>
                                <tr style={{display: 'grid', gridTemplateColumns: `0.25fr ${gridTemplateColumns} 0.25fr 0.25fr`, width:'100%'}}>
                                <th><input type='checkbox'/></th>
                                    {this.renderColumns()}
                                <th><i className="far fa-edit"></i></th>
                                <th><i className="far fa-trash-alt"></i></th>
                                </tr>
                            </thead>
                            <tbody style={bodyStyleProps || this._defaultBodyStyleProps}>
                                {data && data.length > 0? this.renderRows(gridTemplateColumns): <tr><td>Data Prop is missing</td></tr>}
                            </tbody>
                        </table>
                </section>
                  : 'Columns are not defined'}
                {cols && data && pagination && <Pagination
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