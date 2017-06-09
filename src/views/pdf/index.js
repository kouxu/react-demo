import React from 'react';
import {Table} from 'antd';
import reqwest from 'reqwest';
import {
    Link
} from 'react-router-dom';
import './index.css';

const columns = [
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
        render: (text, record, index) => <Link to={`/preview/${record.id}`}>预览</Link>
    },
];

class PDF extends React.Component {
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

    render() {
        return (
            <Table columns={columns}
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