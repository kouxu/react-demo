import React from 'react';
import {
    Card, InputNumber, message, BackTop, Button, Icon,
} from 'antd';
import './preview.css';
let $ = require("jquery");

class Preview extends React.Component {

    constructor() {
        super();
        this.readImage(1);
    }

    state = {
        pageNo: 1,
        page: null,
    }

    readImage = (pageNo) => {
        var bookId = this.getId();
        $.ajax({
                url: 'http://www.hbsrcfwj.cn/api/biz/bookPage',
                type: "PUT",
                data: JSON.stringify({q: {bookId: bookId, pageNo: pageNo}}),
                contentType: "application/json"
            }
        ).success((response) => {
            if (response && response.content.length > 0) {
                this.setState({pageNo: pageNo, page: response.content[0].page})
            }
        }).fail((error) => {
            message.error(error);
        });
    }

    getId = () => {
        let url = window.location.href;
        let id = url.slice(url.lastIndexOf("/") + 1, url.length);
        return id;
    }

    onChange = (value) => {
        this.setState({pageNo: value});
    }

    onGo = () => {
        this.readImage(this.state.pageNo);
    }

    onPrev = () => {
        if (this.state.pageNo > 1) {
            this.readImage(this.state.pageNo - 1);
        }
    }

    onNext = () => {
        this.readImage(this.state.pageNo + 1);
    }


    render() {
        return (
            <div style={{textAlign: "center"}}>
                <BackTop>
                    <div className="ant-back-top-inner">UP</div>
                </BackTop>
                当前页:<InputNumber min={1} defaultValue={1} value={this.state.pageNo}
                                 style={{margin: "10px"}} onChange={this.onChange}/>
                <Button type="primary" size="default" onClick={this.onGo}>跳转</Button>
                <Button.Group size="default" style={{marginLeft: "30px"}}>
                    <Button type="primary" onClick={this.onPrev}>
                        <Icon type="left"/>上一页
                    </Button>
                    <Button type="primary" onClick={this.onNext}>
                        下一页<Icon type="right"/>
                    </Button>
                </Button.Group>
                <Card style={{width: 800}} bodyStyle={{padding: 0}}>
                    <div className="custom-image">
                        <img alt="Not Found" width="100%" src={this.state.page}/>
                    </div>
                </Card>

            </div>
        )
    }
}

export default Preview



