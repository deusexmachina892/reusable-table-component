import React, { Component } from 'react';

class Pagination extends Component{

    componentDidMount(){
        const node = this.refs['1'];
        node.focus();
    }
    renderPageLinks(totalPages){
    
        const pageArray = Object.keys(Array(totalPages).fill(1)).map(x => Number(x)+1)
        return pageArray.map(page => (
            <span 
                className='pageLinks' 
                key={page}
                tabIndex ='1'
                ref={page}
                onClick = {() => this.props.handlePageDisplay(page)}
                >{page}</span>
       ))
    }
    render(){
        const { length, rowsPerPage } = this.props;
        const totalPages = rowsPerPage?length % rowsPerPage === 0?
                                parseInt(length/rowsPerPage)
                                : parseInt(length/rowsPerPage) + 1
                                : 0;
        return(
            <section className='pagination'>
                <main>
                    <span className='paginationInfoGroup'>
                            <span>
                                <label>Enter Rows Per Page</label>
                            </span>
                            <span>
                                <input 
                                        value={rowsPerPage}
                                        //onFocus={() => this.props.resetRowState()}
                                        onChange={(e)=> this.props.handleRowNumberChange(e)}
                                        onBlur={(e) => this.props.checkRowStateOnBlur(e)}
                                    />
                            </span>
                            <span>
                                <label>of {length} Rows</label>
                            </span>
                   </span>
                    <span className='paginationBtnGroup'>
                        <button className='paginationBtn'>
                        Previous
                        </button>
                        <button className='paginationBtn'>
                                Next
                            </button>
                    </span>
                </main>
                <footer>
                    { this.renderPageLinks(totalPages) }
                </footer>
            </section>
        )
    }
}

export default Pagination;