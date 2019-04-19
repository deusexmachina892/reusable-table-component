import React, { PureComponent, Fragment } from 'react';
import fuzzysort from 'fuzzysort';
import mapKeys from 'lodash.mapkeys';

import Pagination from './Pagination';
import '../../assets/table.css';
import Modal from './Modal';

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
            changeSelectedRows: false,
            editingRowIndex: null,
            _uniqueRowKey: null,
            isMultiple: false,
            displayModal: false,
            isSet: false
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
        this.selectRows = this.selectRows.bind(this);
        this.handleColumnClick = this.handleColumnClick.bind(this);
        this.handleRowNumberChange = this.handleRowNumberChange.bind(this);
        this.resetRowStateOnFocus = this.resetRowStateOnFocus.bind(this);
        this.checkRowStateOnBlur = this.checkRowStateOnBlur.bind(this);
        this.handlePageDisplay = this.handlePageDisplay.bind(this);
        this.updatePage = this.updatePage.bind(this);
        this.filterData = this.filterData.bind(this);
        this.handleRowInsert = this.handleRowInsert.bind(this);
        this.handleRowEdit = this.handleRowEdit.bind(this);
        this.handleRowDelete = this.handleRowDelete.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.toggleMultipleEdit = this.toggleMultipleEdit.bind(this);
        this.toggleModalDisplay = this.toggleModalDisplay.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
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
            const { data, rowsPerPage, isSet } = this.state;
            if(!isSet) {
                this.setState({
                    rowsPerPage: data.length
                })
            } else {
                const lastPage = data.length % rowsPerPage === 0? (data.length / rowsPerPage) : parseInt(data.length / rowsPerPage) + 1;
                console.log(lastPage)
                this.setState({
                    currentPage: lastPage
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
        const { 
            data, 
            currentPage, 
            rowsPerPage, 
            colTitles,
            editingRowIndex,
            selectedRows,
            isMultiple,
            _uniqueRowKey
        } = this.state; 
        // startingIndex depending on selected page
        const startingIndex = rowsPerPage * (currentPage -1);
        // Ending index depending on selected page
        const endingIndex = rowsPerPage * currentPage;
        const rows = data.slice(startingIndex, endingIndex);
        return rows.map((row) => {
            const uniqueParam = row[_uniqueRowKey];
            const rowIndex = this.state.data.indexOf(row);
            const checker = (isMultiple  
                && (selectedRows.length === 0 
                    || selectedRows.includes(row)))
                || (editingRowIndex !== null 
            && editingRowIndex === rowIndex);
            const checkBoxChecker = selectedRows.length === 0? isMultiple :selectedRows.includes(row);
            return(uniqueParam && <tr 
                    key={uniqueParam}
                    className={ this.state.selectedRows.includes(uniqueParam)? 'selectedRow': ''}
                    style={{display: 'grid', gridTemplateColumns: `0.25fr ${gridTemplateColumns} 0.25fr 0.25fr`, width:'100%'}} 
                >
                    <td><input type='checkbox' 
                    checked={checkBoxChecker} onChange={()=> this.selectRows(row, uniqueParam)}/></td>
                { 
                    colTitles.map(key => {
                        return(
                            <td key={key}>
                                {  
                                   checker?
                                    key !== _uniqueRowKey?
                                    <input 
                                        type='text'
                                        placeholder={this.state.data[rowIndex][key]}
                                        onChange={(e) => this.handleRowEdit(e, row, key, rowIndex)}
                                        style={{width: '100%', height: '100%'}}
                                        />
                                        : <div>{row[key]}<span>(Unique Keys are Not editable)</span></div>
                                        :
                                <div>{row[key] || 'NA'}</div>}
                            </td>
                        );
                    })
                }
                <td onClick={() =>  !checkBoxChecker && this.toggleEdit(rowIndex)
                      
                        }>
                    {   
                        editingRowIndex !== null && editingRowIndex === rowIndex?
                        <i className="fas fa-check" style={{color: 'green'}}></i>
                        :<i className="far fa-edit" style={{color: checkBoxChecker?'#ddd':'#787878'}}></i>
                    }
                </td>
                <td onClick={() => !checkBoxChecker && this.handleRowDelete(row, rowIndex)}>
                    <i className="far fa-trash-alt" style={{color: checkBoxChecker?'#ddd':'#787878'}}></i>
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

    // clear out on focus
    resetRowStateOnFocus(){
        this.setState({
            rowsPerPage: ''
        })
    }
    // method for handling number of rows per page in the pagination
    handleRowNumberChange(e){
        // console.log(e.target.value);
        const rowsPerPage = e.target.value;
        const { data } = this.state;

        if ((Number(rowsPerPage) >0 && Number(rowsPerPage) <= data.length)|| rowsPerPage == '') {
            this.setState({
                rowsPerPage,
                isSet: true
            });
        }
       
    }

    // method to check row state when input is empty on blur
    checkRowStateOnBlur(){
        if(!this.state.rowsPerPage){
            this.setState({ rowsPerPage: this.props.data.length < 20?
                                         this.props.data.length:20,
                            isSet: false
                        });
        }
    }
    
    // method to handle the current page display
    handlePageDisplay(page){
        this.setState({ currentPage: page})
    }

    // update page display on button click
    updatePage(type) {
        const { currentPage, data, rowsPerPage } = this.state;
        const firstPage = 1;
        const lastPage = data.length % rowsPerPage === 0? (data.length / rowsPerPage) : parseInt(data.length / rowsPerPage) + 1;
        let newPage;
        if(type === 'prev') {
            newPage = currentPage - 1;
            if (currentPage !== firstPage) {
                this.setState({
                    currentPage: newPage
                });
            }
        } else {
            newPage = currentPage + 1;
            if (currentPage !== lastPage) {
                this.setState({
                    currentPage: newPage
                });
            }
        }
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
        const data = this.state.data.filter(item => item !== row);
        this.setState({data});

    }


    toggleMultipleEdit(){
        const { isMultiple  } = this.state;
        this.setState({
            isMultiple: !isMultiple
        })
    }

    toggleModalDisplay(){
        const { displayModal } = this.state;
        this.setState({
            displayModal: !displayModal
        })
    }
    
    closeModal(e){
        e.stopPropagation();
        this.setState({
            displayModal: false
        })
    }
    confirmDelete(){
        this.setState({
            data: [],
        });
        this.toggleModalDisplay();
    }
    render(){
        const { 
            data,
            rowsPerPage,
            displayModal
        } = this.state;
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
                        <i className="fas fa-plus"
                        ></i>
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
                                <th
                                     onClick={() => this.toggleMultipleEdit()}
                                ><input type='checkbox'/></th>
                                    {this.renderColumns()}
                                <th
                                    onClick={() => this.toggleMultipleEdit()}
                                    >
                                    <i className="far fa-edit"></i>
                                </th>
                                <th
                                    onClick={() => this.toggleModalDisplay()}
                                ><i className="far fa-trash-alt"></i></th>
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
                                resetRowStateOnFocus={this.resetRowStateOnFocus}
                                checkRowStateOnBlur={this.checkRowStateOnBlur}
                                handlePageDisplay ={this.handlePageDisplay}
                                currentPage={this.state.currentPage}
                                updatePage={this.updatePage}
                                />}
                {displayModal && <Modal
                    display={displayModal}
                >
                    <article className='modalContent'>
                        <div>Are you sure you want to delete all rows?</div>
                        <button className='addRowBtn' onClick={() => this.confirmDelete()}>Yes</button>
                        <button className='cancelBtn' onClick={(e) => 
                            this.closeModal(e)
                        }>Cancel</button>
                    </article>
                        </Modal>}
            </Fragment>
        )
    }
}

export { Table };