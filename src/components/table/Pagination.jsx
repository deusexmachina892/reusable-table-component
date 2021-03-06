import React, { PureComponent } from 'react';

class Pagination extends PureComponent{
    componentDidMount(){
        console.log(this.refs)
        const node = this.refs['1'];
        node.focus();
    }
    componentDidUpdate(prevProps){
       if((prevProps.currentPage !== this.props.currentPage
            || this.props.rowsPerPage && prevProps.rowsPerPage !== this.props.rowsPerPage
            || prevProps.length !== this.props.length) && this.props.isSearch
        ) {
           const node = this.refs[this.props.currentPage];
           node && node.focus();
       }
    }
    renderPageLinks(totalPages){
    
        const pageArray = Object.keys(Array(totalPages).fill(1)).map(x => Number(x)+1);
        return pageArray.map(page => (
            <span 
                className='pageLinks' 
                key={page}
                tabIndex ='0'
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
                                        onFocus={() => this.props.resetRowStateOnFocus()}
                                        onChange={(e)=> this.props.handleRowNumberChange(e)}
                                        onBlur={(e) => this.props.checkRowStateOnBlur(e)}
                                    />
                            </span>
                            <span>
                                <label>of {length} Rows</label>
                            </span>
                   </span>
                    <span className='paginationBtnGroup'>
                        <button className='paginationBtn' 
                            onClick= {() => this.props.updatePage('prev')}
                        >
                        Previous
                        </button>
                        <button className='paginationBtn'
                            onClick= {() => this.props.updatePage('next')}
                        >
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