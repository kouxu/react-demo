import React from 'react';
import ReactPDF from 'react-pdf';

class PDFDemo extends React.Component {
    state = {
        total: 1,
        pageIndex: 0,
        pageNumber: 1,
    }
    onDocumentLoad = (pageInfo) => {
        this.setState({total: pageInfo.total});
    }

    onPageLoad = (pageInfo) => {
        this.setState({pageIndex: pageInfo.pageIndex, pageNumber: pageInfo.pageNumber});
    }

    onNext = () => {
        this.setState({pageIndex: this.state.pageIndex + 1});
    }

    onPrev = () => {
        this.setState({pageIndex: this.state.pageIndex - 1});
    }

    render() {
        return (
            <div>
                <button onClick={this.onPrev}>Prev Page</button>
                <button onClick={this.onNext}>Next Page</button>
                <ReactPDF
                    file="/sfsj.pdf"
                    pageIndex={this.state.pageIndex}
                    onDocumentLoad={this.onDocumentLoad}
                    onPageLoad={this.onPageLoad}
                />
                <p>Page {this.state.pageIndex} of {this.state.total}</p>
            </div>
        );
    }
}

export default PDFDemo