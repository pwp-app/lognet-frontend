import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col, message, Skeleton, Button, Table, Popconfirm } from 'antd';
import { EyeOutlined, CopyOutlined, EyeFilled, EditFilled, DeleteFilled } from '@ant-design/icons';
import NumberCard from '../../components/main/numbercard';
import axios from '../../utils/axios';

const mapState = (state) => ({
    site: state.site,
});

const logTableColumns = [
    {
        title: '提交时间',
        dataIndex: 'createTime',
        key: 'createTime'
    },
    {
        title: '出错路径',
        dataIndex: 'path',
        key: 'path',
    },
    {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        render: (text) => text.length > 30 ? text.replace(/(\r\n)|(\n)/g, '').substring(0, 30) + '...' : text.replace(/(\r\n)|(\n)/g, '')
    }
];

const missionColumns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name'
    }, {
        title: '描述',
        dataIndex: 'description',
        key: 'description'
    }, {
        title: '起始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        render: (value) => value ? value : '-'
    }, {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        render: (value) => value ? value : '-'
    }, {
        title: '状态',
        dataIndex: 'enabled',
        key: 'enabled',
        render: (value) => value ? '可用' : '禁用中'
    }, {
        title: '操作',
        key: 'operation',
        render: (_, record) => {
            return (
                <div className="button-group">
                    <Button
                        key={'btn_view_' + record.id}
                        icon={<EyeFilled />}
                        onClick={() => {
                            
                        }}
                    ></Button>
                    <Button
                        key={'btn_edit_' + record.id}
                        icon={<EditFilled />}
                        onClick={() => {
                            
                        }}
                    ></Button>
                    <Popconfirm
                        placement="topRight"
                        key={'btn_delete' + record.id}
                        title="确定要删除吗？所有和该任务有关的数据都会被删除，且该操作不可逆"
                        okText="确定"
                        cancelText="取消"
                        onConfirm={() => {
                            
                        }}
                    >
                        <Button type="danger" icon={<DeleteFilled />}></Button>
                    </Popconfirm>
                </div>
            );
        },
    }
]

class SiteDetailPage extends React.Component {
    state = {
        site: {},
        showKey: false,
        stats: {
            total: 0,
            running: 0,
            totalLog: 0,
            recentLog: 0,
        },
        logs: null,
        logs_loading: true,
        logs_pagination: {
            page: 1,
            pageSize: 10,
        },
        missions: null,
        mission_loading: true,
        mission_pagination: {
            page: 1,
            pageSize: 10,
        }
    };
    initTables = () => {
        this.refreshLogs();
        this.refreshMissions();
    }
    refreshLogs = () => {
        this.fetchLogs(this.state.logs_pagination);
    }
    refreshMissions = () => {
        this.fetchMissions(this.state.mission_pagination);
    }
    fetchLogs = (pagination) => {
        axios.get('/general_log/list', {
            params: {
                siteId: this.state.site.id,
                page: pagination.page,
                pageSize: pagination.pageSize,
            },
        }).then(res => {
            if (res.data && res.data.code === 200) {
                this.setState({
                    logs: res.data.data.data,
                    logs_loading: false,
                    logs_pagination: {
                        total: res.data.data.total,
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                    },
                });
            } else {
                this.setState({
                    logs_loading: false,
                });
                message.error('错误日志列表获取失败');
            }
        }, () => {
            this.setState({
                logs_loading: false,
            });
            message.error('错误日志列表获取失败');
        });
    }
    fetchMissions = (pagination) => {
        axios.get('/mission/list', {
            params: {
                siteId: this.state.site.id,
                page: pagination.page,
                pageSize: pagination.pageSize,
            },
        }).then(res => {
            if (res.data && res.data.code === 200) {
                this.setState({
                    missions: res.data.data.data,
                    mission_loading: false,
                    mission_pagination: {
                        total: res.data.data.total,
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                    }
                });
            } else {
                this.setState({
                    mission_loading: false,
                });
                message.error('任务列表获取失败');
            }
        }, () => {
            this.setState({
                mission_loading: false,
            });
            message.error('任务列表获取失败');
        });
    }
    componentDidMount() {
        if (this.props.site) {
            this.setState({
                site: this.props.site,
            }, () => {
                this.initTables();
            });
        } else {
            axios
                .get('/site/fetchInfo', {
                    params: {
                        id: this.props.match.params.id,
                    },
                })
                .then(
                    (res) => {
                        if (res.data && res.data.code === 200) {
                            this.setState({
                                site: res.data.data,
                            }, () => {
                                this.initTables();
                            });
                        } else {
                            message.error(res.data.message);
                        }
                    },
                    (err) => {
                        console.log(err);
                        message.error('与服务器通讯失败，无法获取站点的信息');
                    }
                );
        }
    }
    render() {
        return (
            <div className="page-site">
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card>
                            {this.state.site ? (
                                <>
                                    <div className="site-domain">
                                        <span>{this.state.site.domain}</span>
                                    </div>
                                    <div className="site-appkey">
                                        <span style={{ userSelect: 'none' }}>App Key: </span>
                                        <span>{this.state.showKey ? this.state.site.appKey : '*'.repeat(40)}</span>
                                        <span>
                                            <EyeOutlined
                                                onClick={() => {
                                                    this.setState({ showKey: !this.state.showKey });
                                                }}
                                            />
                                            <CopyOutlined
                                                onClick={() => {
                                                    navigator.clipboard.writeText(this.state.site.appKey);
                                                    message.success('已复制到剪贴板');
                                                }}
                                            />
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <Skeleton />
                            )}
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <NumberCard span={6} title="任务总数" number={this.state.stats.total}/>
                    <NumberCard span={6} title="运行中任务" number={this.state.stats.running}/>
                    <NumberCard span={6} title="总错误日志数" number={this.state.stats.totalLog}/>
                    <NumberCard span={6} title="近七天错误日志数" number={this.state.stats.recentLog}/>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card title="错误日志" className="card-table" extra={<Button onClick={this.refreshLogs}>刷新</Button>}>
                            <Table
                                columns={logTableColumns}
                                dataSource={this.state.logs}
                                loading={this.state.logs_loading}
                                pagination={this.state.logs_pagination}
                                rowKey={(row) => row.id} />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card
                            title="任务列表"
                            className="card-table"
                            extra={
                                <div className="button-group">
                                    <Button onClick={this.refreshMissions}>刷新</Button>
                                    <Button type="primary" onClick={this.addMission}>
                                        添加
                                    </Button>
                                </div>
                            }
                        >
                            <Table
                                columns={missionColumns}
                                datasource={this.state.missions}
                                loading={this.state.mission_loading}
                                pagination={this.state.mission_pagination}
                                rowKey={(row) => row.id}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}



export default connect(mapState, null)(SiteDetailPage);
