import React from 'react';
import {
    Form, Progress, message, DatePicker,
    Button, Upload, Icon, Input,
} from 'antd';

let PDFJS = require("../../../node_modules/pdfjs-dist/build/pdf");
PDFJS.workerSrc = require('../../../node_modules/pdfjs-dist/build/pdf.worker');
PDFJS.disableWorker = true;
const FormItem = Form.Item;
let $ = require("jquery");

class Demo extends React.Component {
    state = {
        selectedFile: null,
        total: 0,
        pageNum: 0,
        percent: 0,
    }

    normFile = (e) => {
        this.setState({selectedFile: e.file})
    }

    save = (entry, data, callback) => {
        $.ajax({
            url: 'http://www.hbsrcfwj.cn/api/biz/' + entry,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
        }).success((response) => {
            if (callback) {
                callback(response.content)
            }
        }).fail((error) => {
            message.error(error);
        })
    }

    getPage = (pdf, bookId, pageNum) => {
        pdf.getPage(pageNum).then((page) => {
            var scale = 1;
            var viewport = page.getViewport(scale);
            var canvas = $('#canvas')[0];
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var task = page.render({canvasContext: context, viewport: viewport});
            task.promise.then(() => {
                var png = canvas.toDataURL('image/png');
                this.save('bookPage', {
                    bookId: bookId,
                    pageNo: pageNum,
                    page: png
                });

                this.setState({
                    pageNum: pageNum,
                    total: pdf.numPages,
                    percent: pageNum / pdf.numPages * 100
                })
                if (pageNum < pdf.numPages) {
                    this.getPage(pdf, bookId, ++pageNum);
                }
            });
        });
    }

    handleUpload = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                return;
            }
            let file = this.state.selectedFile
            if (!file) {
                message.warning('Please select the file you want to upload.');
                return;
            }
            this.setState({
                pageNum: 0,
                total: 0,
                percent: 0
            })
            let fileReader = new FileReader();
            fileReader.onload = (ev) => {
                PDFJS.getDocument(fileReader.result).then((pdf) => {
                    this.save('book', {
                        name: values['name'],
                        period: values['period'],
                        publicationDate: values['publication-date'].format('YYYY-MM-DD'),
                        totalPage: pdf.numPages
                    }, (data) => {
                        this.getPage(pdf, data.id, 1);
                    });
                }, (error) => {
                    message.error(error);
                });
            };
            fileReader.readAsArrayBuffer(file.originFileObj);
        });

    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        return (

            <div>

                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="书名"
                        hasFeedback
                    >
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: 'Please input book name!', whitespace: true}],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="期数"
                        hasFeedback
                    >
                        {getFieldDecorator('period', {
                            rules: [{required: true, message: 'Please input book number!', whitespace: true}],
                        })(
                            <Input />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="出版日期"
                    >
                        {getFieldDecorator('publication-date', {
                            rules: [{type: 'object', required: true, message: 'Please select date!'}],
                        })(
                            <DatePicker />
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="文件"
                    >
                        <div className="dropbox">
                            {getFieldDecorator('dragger', {
                                valuePropName: 'fileList',
                                getValueFromEvent: this.normFile,
                            })(
                                <Upload.Dragger name="files" accept="pdf">
                                    <p className="ant-upload-drag-icon">
                                        <Icon type="inbox"/>
                                    </p>
                                    <p className="ant-upload-text">单击或者拖放一个文件到当前区域</p>
                                    <p className="ant-upload-hint">请只选择pdf文件进行上传，暂时不支持其他格式文件，请在进度条完成后离开当前页面，否则可能丢失页数</p>
                                </Upload.Dragger>
                            )}
                        </div>
                    </FormItem>

                    <FormItem
                        wrapperCol={{span: 12, offset: 6}}
                    >
                        <Button type="primary" htmlType="submit" onClick={this.handleUpload}>上传并保存</Button>
                    </FormItem>
                </Form>

                <div style={{margin: "20px", textAlign: "center"}}>
                    <h3>{this.state.selectedFile ? this.state.selectedFile.name : ''}</h3>
                    <canvas id="canvas" style={{border: "3px solid black", width: "100px", height: "100px"}}></canvas>
                    <p>{this.state.pageNum}/{this.state.total}</p>
                    <Progress percent={this.state.percent} format={percent=>(Math.ceil(percent)+"%")}/>
                </div>
            </div>
        );
    }
}

const UploadForm = Form.create()(Demo);

export default UploadForm