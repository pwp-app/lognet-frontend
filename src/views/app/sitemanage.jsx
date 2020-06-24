import React from 'react';
import { Table, Row, Col, Card, Button, message } from 'antd';
import axios from '../../utils/axios';

class SiteManagePage extends React.Component {
    state = {
        sites: null,
        sites_pagination: {
            page: 1,
            pageSize: 10,
        },
        sites_loading: true,
    };
    fetch = (pagination) => {
        axios
            .get('/admin/listSite', {
                params: {
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                },
            })
            .then(
                (res) => {
                    if (res.data.code === 200 && res.data.data) {
                        this.setState({
                            sites: res.data.data.data,
                            sites_pagination: {
                                total: res.data.data.total,
                                page: pagination.page,
                                pageSize: pagination.pageSize,
                            },
                            sites_loading: false,
                        });
                    }
                },
                () => {
                    this.setState({
                        sites_loading: false,
                    });
                    message.error('站点数据获取失败');
                }
            );
    };
    handleTableChange = (pagination, filters, sorter) => {
        this.setState(
            {
                sites_pagination: pagination,
            },
            () => {
                this.fetch(this.state.sites_pagination);
            }
        );
    };
    refreshTable = () => {
        this.setState({
            sites_loading: true,
        });
        this.fetch(this.state.sites_pagination);
    };
    request = (op, id) => {
        axios
            .post('/admin/' + op, {
                id,
            })
            .then(
                (res) => {
                    if (res.data && res.data.code === 200) {
                        message.success('操作成功');
                        this.refreshTable();
                    } else {
                        message.error(res.data.message);
                    }
                },
                () => {
                    message.error('与服务器通讯失败');
                }
            );
    };
    componentDidMount = () => {
        this.fetch(this.state.sites_pagination);
    };
    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                width: 220,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 200,
            },
            {
                title: 'UID',
                dataIndex: 'uid',
                key: 'uid',
                width: 120,
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                width: 240,
            },
            {
                title: '域名',
                dataIndex: 'domain',
                key: 'domain',
            },
            {
                title: '状态',
                dataIndex: 'enabled',
                key: 'enabled',
                render: (value) => {
                    return value ? '正常' : '禁用';
                },
            },
            {
                title: '操作',
                key: 'operation',
                render: (_, record) => {
                    if (record.enabled) {
                        return (
                            <Button key={'btn_disabled_' + record.id} type="danger" onClick={() => {this.request('banSite', record.id)}}>
                                禁用
                            </Button>
                        );
                    } else {
                        return (
                            <Button key={'btn_enabled_' + record.id} type="primary" onClick={() => {this.request('unbanSite', record.id)}}>
                                启用
                            </Button>
                        );
                    }
                },
            },
        ];
        return (
            <div className="page-sitemanage">
                <Row>
                    <Col span={24}>
                        <Card title="站点列表" className="card-table" extra={<Button onClick={this.refreshTable}>刷新</Button>}>
                            <Table dataSource={this.state.sites} columns={columns} pagination={this.state.sites_pagination} loading={this.state.sites_loading} rowKey={(row) => row.id} handleTableChange={this.handleTableChange} />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SiteManagePage;
