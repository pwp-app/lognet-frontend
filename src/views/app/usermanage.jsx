import React from 'react';
import { Row, Col, Table, Card, Button, message } from 'antd';
import { connect } from 'react-redux';
import axios from '../../utils/axios';

const mapState = (state) => ({
    user: state.user,
});

class UserManagePage extends React.Component {
    state = {
        users: null,
        user_pagination: {
            page: 1,
            pageSize: 15,
        },
        users_loading: true,
    };
    fetch = (pagination) => {
        axios
            .get('/admin/listUser', {
                params: {
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                },
            })
            .then(
                (res) => {
                    if (res.data.code === 200 && res.data.data) {
                        this.setState({
                            users: res.data.data.data,
                            user_pagination: {
                                total: res.data.data.total,
                                page: pagination.page,
                                pageSize: pagination.pageSize,
                            },
                            users_loading: false,
                        });
                        console.log(res.data.data.data);
                    }
                },
                () => {
                    this.setState({
                        users_loading: false,
                    });
                    message.error('用户数据获取失败');
                }
            );
    };
    handleTableChange = (pagination, filters, sorter) => {
        this.setState(
            {
                user_pagination: pagination,
            },
            () => {
                this.fetch(this.state.user_pagination);
            }
        );
    };
    refreshTable = () => {
        this.setState({
            users_loading: true,
        });
        this.fetch(this.state.user_pagination);
    };
    componentDidMount = () => {
        this.fetch(this.state.user_pagination);
    }
    request = (op, id) => {
        axios.post('/admin/' + op, {
            uid: id,
        }).then(res => {
            if (res.data && res.data.code === 200) {
                message.success("操作成功");
                this.refreshTable();
            } else {
                message.error(res.data.message);
            }
        }, () => {
            message.error("与服务器通讯失败");
        });
    }
    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'uid',
                key: 'id',
                width: 140,
            },
            {
                title: '注册时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 240,
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '角色',
                dataIndex: 'role',
                key: 'role',
                width: 160,
                render: (text) => {
                    switch (text) {
                        case 'admin':
                            return '管理员';
                        case 'user':
                            return '用户';
                        default:
                            return '游客';
                    }
                }
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
                    if (record.uid === this.props.user.uid) {
                        return '-';
                    }
                    const res = [];
                    if (record.enabled) {
                        res.push(
                            <Button key={'btn_disabled_' + record.uid} type="danger" onClick={() => {this.request('banUser', record.uid)}}>禁用</Button>
                        );
                    } else {
                        res.push(
                            <Button key={'btn_enabled_' + record.uid} type="primary" onClick={() => {this.request('unbanUser', record.uid)}}>启用</Button>
                        );
                    }
                    if (record.role === 'admin') {
                        res.push(
                            <Button key={'btn_user_' + record.uid} type="primary" onClick={() => {this.request('setUser', record.uid)}}>设为用户</Button>
                        );
                    } else if (record.role === 'user') {
                        res.push(
                            <Button key={'btn_admin_' + record.uid} type="primary" onClick={() => {this.request('setAdmin', record.uid)}}>设为管理员</Button>
                        );
                    }
                    return (
                        <div className="button-group">
                            {res}
                        </div>
                    )
                }
            }
        ];
        return (
            <div className="page-usermanage">
                <Row>
                    <Col span={24}>
                        <Card title="用户列表" className="card-table" extra={<Button onClick={this.refreshTable}>刷新</Button>}>
                            <Table dataSource={this.state.users} columns={columns} pagination={this.state.pagination} loading={this.state.users_loading} rowKey={(row) => row.uid} handleTableChange={this.handleTableChange}></Table>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(mapState, null)(UserManagePage);
