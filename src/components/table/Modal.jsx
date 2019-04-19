import React, { PureComponent } from 'react';
import { createPortal } from 'react-dom';

class Modal extends PureComponent{
    constructor(props){
        super(props);
        this.el = document.createElement('div');
        this.el.setAttribute('class', 'modalContainer');
        this.root = document.getElementById('modal-root');
    }
    componentDidMount(){
        this.root.appendChild(this.el);
    }
    componentWillUnmount() {
        this.root.removeChild(this.el);
    }
    render(){
        const {display} = this.props;
        return display?
                    createPortal(
                        this.props.children,
                        this.el
                    )
                    : null;
    }
}

export default Modal;