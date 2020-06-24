import React from 'react';
import { connect } from 'react-redux';
import { Card, Row, Col, Skeleton, message, Button, Table, Popconfirm, Modal } from 'antd';
import { CopyOutlined, EyeFilled, DeleteFilled } from '@ant-design/icons';
import axios from '../../utils/axios';
import NumberCard from '../../components/main/numbercard';

const mapState = (state) => ({
    mission: state.mission,
});

const getTypeSpan = (type) => {
    if (type === 'debug') {
        return <span className="logtype logtype-debug">调试</span>
    } else if (type === 'info') {
        return <span className="logtype logtype-info">信息</span>
    } else if (type === 'warn') {
        return <span className="logtype logtype-warn">警告</span>
    } else if (type === 'debug') {
        return <span className="logtype logtype-error">错误</span>
    }
}

class MissionPage extends React.Component {
    constructor(props) {
        super(props);
        this.logModal = React.createRef();
    }
    state = {
        mission: null,
        stats: {
            total: 0,
            today: 0,
            totalError: 0,
            todayError: 0,
        },
        logs: null,
        logs_loading: true,
        logs_pagination: {
            page: 1,
            pageSize: 10,
        },
    };
    goBack = () => {
        if (window.location.search.includes('from=dashboard')) {
            this.props.history.push('/app');
        } else {
            this.props.history.push(`/app/sites/detail/${this.state.mission.siteId}`);
        }
    };
    copyId = () => {
        navigator.clipboard.writeText(this.state.mission.id);
        message.success('复制成功');
    }
    refreshTable = () => {
        this.setState({
            logs_loading: true,
        });
        this.fetchLogs(this.state.logs_pagination);
    };
    fetchStats = () => {
        axios.get('/mission/fetchStats', {
            params: {
                id: this.state.mission.id
            }
        }).then(res => {
            if (res.data.code === 200) {
                this.setState({
                    stats: res.data.data
                });
            }
        });
    };
    fetchLogs = (pagination) => {
        axios
            .get('/mission_log/list', {
                params: {
                    missionId: this.state.mission.id,
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                },
            })
            .then(
                (res) => {
                    if (res.data.code === 200) {
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
                        message.error(res.data.message);
                    }
                },
                () => {
                    this.setState({
                        logs_loading: false,
                    });
                    message.error('与服务器通信失败，无法获取日志');
                }
            );
    };
    deleteLog = (id) => {
        axios.post('/mission_log/delete', {
            id,
            missionId: this.state.mission.id
        }).then(res => {
            if (res.data.code === 200) {
                message.success('删除成功');
                this.refreshTable();
            } else {
                message.error(res.data.message);
            }
        }, () => {
            message.error('与服务器通信失败');
        })
    }
    componentDidMount() {
        if (this.props.mission) {
            this.setState({
                mission: this.props.mission,
            }, () => {
                this.refreshTable();
                this.fetchStats();
            });
        } else {
            axios
                .get('/mission/fetchInfo', {
                    params: {
                        id: this.props.match.params.id,
                    },
                })
                .then(
                    (res) => {
                        if (res.data.code === 200) {
                            this.setState(
                                {
                                    mission: res.data.data,
                                },
                                () => {
                                    this.refreshTable();
                                    this.fetchStats();
                                }
                            );
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
        const columns = [
            {
                title: '提交时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 200,
            },
            {
                title: '路径',
                dataIndex: 'path',
                key: 'path',
                render: (text) => {
                    return <span className="table-linewrap">{text}</span>;
                }
            },
            {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                render: (text) => {
                    return getTypeSpan(text);
                },
                width: 140,
            },
            {
                title: '内容',
                dataIndex: 'content',
                key: 'content',
                render: (text) => {
                    return <span className="table-linewrap table-linewrap-lg">{text}</span>;
                }
            },
            {
                title: '操作',
                key: 'operation',
                render: (_, record) => {
                    return (
                        <div className="button-group">
                            <Button
                                key={'btn_view_' + record.id}
                                icon={<EyeFilled />}
                                onClick={() => {
                                    this.logModal.current.show(record);
                                }}
                            ></Button>
                            <Popconfirm
                                placement="topRight"
                                key={'btn_delete' + record.id}
                                title="确定要删除这条日志吗？"
                                okText="确定"
                                cancelText="取消"
                                onConfirm={() => {
                                    this.deleteLog(record.id);
                                }}
                            >
                                <Button type="danger" icon={<DeleteFilled />}></Button>
                            </Popconfirm>
                        </div>
                    );
                }
            }
        ]
        return (
            <div className="page-mission">
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card className="mission-header-card">
                            {this.state.mission ? (
                                <>
                                    <div className="mission-name">
                                        <span className="mission-name-title">{this.state.mission.name}</span>
                                        <span className="mission-name-id"><span>ID: </span><span>{this.state.mission.id}</span><CopyOutlined onClick={this.copyId}/></span>
                                        <Button onClick={this.goBack}>返回</Button>
                                    </div>
                                    {this.state.mission.startTime || this.state.mission.endTime ? (
                                        <div className="mission-time">
                                            {this.state.mission.startTime ? <span>开始时间：{this.state.mission.startTime.split(' ')[0]}</span> : null} {this.state.mission.endTime ? <span>结束时间：{this.state.mission.endTime.split(' ')[0]}</span> : null}
                                        </div>
                                    ) : null}
                                    {this.state.mission.desc ? <div className="mission-desc">{this.state.mission.name}</div> : null}
                                </>
                            ) : (
                                <Skeleton active />
                            )}
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <NumberCard title="总日志数" number={this.state.stats.total} span={6} />
                    <NumberCard title="今天提交的日志数" number={this.state.stats.today} span={6} />
                    <NumberCard title="错误日志数" number={this.state.stats.totalError} span={6} />
                    <NumberCard title="今天提交的错误日志数" number={this.state.stats.todayError} span={6} />
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card
                            title="日志列表"
                            className="card-table"
                            extra={
                                <div className="button-group">
                                    <Button onClick={this.refreshTable}>刷新</Button>
                                </div>
                            }
                        >
                            <Table columns={columns} dataSource={this.state.logs} pagination={this.state.logs_pagination} loading={this.state.logs_loading} rowKey={(row) => row.id} />
                        </Card>
                    </Col>
                </Row>
                <LogModal ref={this.logModal} />
            </div>
        );
    }
}

class LogModal extends React.Component {
    state = {
        visible: false,
        log: {},
    };
    show = (record) => {
        this.setState({
            visible: true,
            log: record,
        });
    };
    render() {
        const layout = {
            left: 4,
            right: 20
        }
        return (
            <Modal className="modal-log-detail" width={680} visible={this.state.visible} onCancel={() => this.setState({ visible: false })} onOk={() => this.setState({ visible: false })} title="日志详情">
                <Row>
                    <Col span={layout.left}>
                        <span>提交时间: </span>
                    </Col>
                    <Col span={layout.right}>
                        <span>{this.state.log.createTime}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={layout.left}>
                        <span>路径: </span>
                    </Col>
                    <Col span={layout.right}>
                        <span>{this.state.log.path}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={layout.left}>
                        <span>类型: </span>
                    </Col>
                    <Col span={layout.right}>
                        <span>{getTypeSpan(this.state.log.type)}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={layout.left}>
                        <span>User Agent: </span>
                    </Col>
                    <Col span={layout.right}>
                        <span>{this.state.log.userAgent}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={layout.left}>
                        <span>屏幕信息: </span>
                    </Col>
                    <Col span={layout.right}>
                        {this.state.log.clientWidth && this.state.log.clientHeight && this.state.log.windowInnerWidth && this.state.log.windowInnerHeight && this.state.log.windowOuterWidth && this.state.windowOuterHeight ? (
                            <span>
                                Client: {this.state.log.clientWidth} x {this.state.log.clientHeight}, Window: {this.state.log.windowInnerWidth} x {this.state.log.windowInnerHeight} | {this.state.log.windowOuterWidth} x {this.state.log.windowOuterHeight}
                            </span>
                        ) : null}
                    </Col>
                </Row>
                <Row>
                    <Col span={layout.left}>
                        <span>内容: </span>
                    </Col>
                    <Col span={layout.right}>
                        <span>{this.state.log.content}</span>
                    </Col>
                </Row>
            </Modal>
        );
    }
}

export default connect(mapState, null)(MissionPage);
