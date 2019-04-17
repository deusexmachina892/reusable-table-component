import React, { Component } from 'react';

class Pagination extends Component{
    render(){
        const { length } = this.props;
        return(
            <section className='pagination'>
                <main>
                    <button className='paginationBtn'>
                        Previous
                    </button>
                    <label>Enter Rows Per Page</label>
                    <input placeholder={length < 20?length:20} />
                    <label>of {length} Pages</label>
                    <button className='paginationBtn'>
                        Next
                    </button>
                </main>
            </section>
        )
    }
}

export default Pagination;