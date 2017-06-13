import React from 'react';
import {Table, Popconfirm} from 'antd';
import reqwest from 'reqwest';
import {
    Link
} from 'react-router-dom';
import './index.css';


class PDF extends React.Component {
    columns = [
        {
            title: '书名',
            dataIndex: 'name',
        },
        {
            title: '期数',
            dataIndex: 'period',
        },
        {
            title: '出版日期',
            dataIndex: 'publicationDate',
        },
        {
            title: '总页数',
            dataIndex: 'totalPage',
        },
        {
            title: '操作',
            dataIndex: '',
            key: 'x',
            render: (text, record, index) => {
                return (
                    <div>
                        <Link to={`/preview/${record.id}`}>预览</Link>
                        <span className="ant-divider"/>
                        <Popconfirm title="确认要删除吗?" onConfirm={() => this.onDelete(index,record.id)}>
                            <a href="##">删除</a>
                        </Popconfirm>
                    </div>
                );
            }
        },
    ];

    state = {
        data: [],
        pagination: {},
        loading: false,
    };
    handleTableChange = (pagination, filters, sorter) => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
            page: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    }
    fetch = (params = {}) => {
        this.setState({loading: true});
        reqwest({
            url: 'http://www.hbsrcfwj.cn/api/biz/book',
            method: 'get',
            data: {
                results: 10,
                ...params,
            },
            type: 'json',
        }).then((data) => {
            const pagination = {...this.state.pagination};
            // Read total count from server
            // pagination.total = data.totalCount;
            pagination.total = data.content.length;
            pagination.pageSize = 10000;
            this.setState({
                loading: false,
                data: data.content,
                pagination,
            });
        });
    }

    componentDidMount() {
        this.fetch();
    }

    onDelete = (index, id) => {
        console.log("index", index)
        reqwest({
            url: 'http://www.hbsrcfwj.cn/api/biz/book/' + id,
            method: 'delete',
            type: 'json',
        }).then((rs) => {
            console.log("rs", rs)
            const data = [...this.state.data];
            data.splice(index, 1);
            const pagination = {...this.state.pagination};
            pagination.total = data.length;
            this.setState({
                loading: false,
                data: data,
                pagination,
            });
        });
    }

    render() {
        return (
            <Table columns={this.columns}
                   rowKey={record => record.id}
                   dataSource={this.state.data}
                   pagination={this.state.pagination}
                   loading={this.state.loading}
                   onChange={this.handleTableChange}
            />
        );
    }
}

export default PDF