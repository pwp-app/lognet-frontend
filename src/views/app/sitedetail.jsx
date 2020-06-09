import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Card, Row, Col, message, Skeleton, Button, Table, Popconfirm, Modal, Form, Input, DatePicker } from 'antd';
import { EyeOutlined, CopyOutlined, EyeFilled, EditFilled, DeleteFilled, PlayCircleFilled, StopFilled } from '@ant-design/icons';
import NumberCard from '../../components/main/numbercard';
import axios from '../../utils/axios';

const mapState = (state) => ({
    site: state.site,
});

const mapDispatch = ({ mission: { setMission } }) => ({
    setMission: (mission) => setMission(mission),
});

const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

class SiteDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.missionModal = React.createRef();
        this.logModal = React.createRef();
    }
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
        },
    };
    initTables = () => {
        this.refreshLogs();
        this.refreshMissions();
    };
    refreshLogs = () => {
        this.setState({
            logs_loading: true,
        });
        this.fetchLogs(this.state.logs_pagination);
    };
    refreshMissions = () => {
        this.setState({
            mission_loading: true,
        });
        this.fetchMissions(this.state.mission_pagination);
    };
    fetchLogs = (pagination) => {
        axios
            .get('/general_log/list', {
                params: {
                    siteId: this.state.site.id,
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
                        message.error('错误日志列表获取失败');
                    }
                },
                () => {
                    this.setState({
                        logs_loading: false,
                    });
                    message.error('错误日志列表获取失败');
                }
            );
    };
    fetchMissions = (pagination) => {
        axios
            .get('/mission/list', {
                params: {
                    siteId: this.state.site.id,
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                },
            })
            .then(
                (res) => {
                    if (res.data.code === 200) {
                        this.setState({
                            missions: res.data.data.data,
                            mission_loading: false,
                            mission_pagination: {
                                total: res.data.data.total,
                                page: pagination.page,
                                pageSize: pagination.pageSize,
                            },
                        });
                    } else {
                        this.setState({
                            mission_loading: false,
                        });
                        message.error('任务列表获取失败');
                    }
                },
                () => {
                    this.setState({
                        mission_loading: false,
                    });
                    message.error('任务列表获取失败');
                }
            );
    };
    addMission = () => {
        this.missionModal.current.show('add');
    };
    editMission = (record) => {
        this.missionModal.current.show('edit', record);
    };
    enableMission = (id) => {
        axios
            .post('/mission/enable', {
                id,
            })
            .then(
                (res) => {
                    if (res.data.code === 200) {
                        message.success('启用成功');
                        this.refreshMissions();
                    } else {
                        message.error(res.data.message);
                    }
                },
                () => {
                    message.error('与服务器通讯失败');
                }
            );
    };
    disableMission = (id) => {
        axios
            .post('/mission/disable', {
                id,
            })
            .then(
                (res) => {
                    if (res.data.code === 200) {
                        message.success('禁用成功');
                        this.refreshMissions();
                    } else {
                        message.error(res.data.message);
                    }
                },
                () => {
                    message.error('与服务器通讯失败');
                }
            );
    };
    deleteMission = (id) => {
        axios
            .post('/mission/delete', {
                id,
            })
            .then(
                (res) => {
                    if (res.data.code === 200) {
                        message.success('删除成功');
                        this.refreshMissions();
                    } else {
                        message.error(res.data.message);
                    }
                },
                () => {
                    message.error('与服务器通讯失败');
                }
            );
    };
    deleteLog = (id) => {
        axios
            .post('/general_log/delete', {
                id,
            })
            .then(
                (res) => {
                    if (res.data.code === 200) {
                        message.success('删除成功');
                        this.refreshLogs();
                    } else {
                        message.error(res.data.message);
                    }
                },
                () => {
                    message.error('与服务器通讯失败');
                }
            );
    };
    fetchStats = () => {
        axios
            .get('/site/fetchStats', {
                params: {
                    id: this.state.site.id,
                },
            })
            .then((res) => {
                if (res.data.code === 200) {
                    this.setState({
                        stats: res.data.data,
                    });
                }
            });
    };
    componentDidMount() {
        if (this.props.site) {
            this.setState(
                {
                    site: this.props.site,
                },
                () => {
                    this.initTables();
                    this.fetchStats();
                }
            );
        } else {
            axios
                .get('/site/fetchInfo', {
                    params: {
                        id: this.props.match.params.id,
                    },
                })
                .then(
                    (res) => {
                        if (res.data.code === 200) {
                            this.setState(
                                {
                                    site: res.data.data,
                                },
                                () => {
                                    this.initTables();
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
        const logTableColumns = [
            {
                title: '提交时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 180,
            },
            {
                title: '出错路径',
                dataIndex: 'path',
                key: 'path',
                render: (text) => {
                    return <span className="table-linewrap">{text}</span>;
                },
            },
            {
                title: '内容',
                dataIndex: 'content',
                key: 'content',
                render: (text) => {
                    return <span className="table-linewrap">{text}</span>;
                },
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
                },
            },
        ];

        const missionColumns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
                render: (text) => (text ? text : '-'),
            },
            {
                title: '起始时间',
                dataIndex: 'startTime',
                key: 'startTime',
                render: (value) => (value ? value.split(' ')[0] : '-'),
                width: 160,
            },
            {
                title: '结束时间',
                dataIndex: 'endTime',
                key: 'endTime',
                render: (value) => (value ? value.split(' ')[0] : '-'),
                width: 160,
            },
            {
                title: '状态',
                dataIndex: 'enabled',
                key: 'enabled',
                render: (value) => (value ? '可用' : '禁用中'),
                width: 160,
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
                                    this.props.setMission(record);
                                    this.props.history.push(`/app/sites/mission/${record.id}`);
                                }}
                            ></Button>
                            <Button
                                key={'btn_edit_' + record.id}
                                icon={<EditFilled />}
                                onClick={() => {
                                    this.editMission(record);
                                }}
                            ></Button>
                            {record.enabled ? (
                                <Button
                                    type="danger"
                                    icon={<StopFilled />}
                                    onClick={() => {
                                        this.disableMission(record.id);
                                    }}
                                ></Button>
                            ) : (
                                <Button
                                    className="button-enable"
                                    type="primary"
                                    icon={<PlayCircleFilled />}
                                    onClick={() => {
                                        this.enableMission(record.id);
                                    }}
                                ></Button>
                            )}
                            <Popconfirm
                                placement="topRight"
                                key={'btn_delete' + record.id}
                                title="确定要删除吗？所有和该任务有关的数据都会被删除，且该操作不可逆"
                                okText="确定"
                                cancelText="取消"
                                onConfirm={() => {
                                    this.deleteMission(record.id);
                                }}
                            >
                                <Button type="danger" icon={<DeleteFilled />}></Button>
                            </Popconfirm>
                        </div>
                    );
                },
            },
        ];
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
                                <Skeleton active />
                            )}
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <NumberCard span={6} title="任务总数" number={this.state.stats.total} />
                    <NumberCard span={6} title="运行中任务" number={this.state.stats.running} />
                    <NumberCard span={6} title="总错误日志数" number={this.state.stats.totalLog} />
                    <NumberCard span={6} title="近七天错误日志数" number={this.state.stats.recentLog} />
                </Row>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <Card title="错误日志" className="card-table" extra={<Button onClick={this.refreshLogs}>刷新</Button>}>
                            <Table columns={logTableColumns} dataSource={this.state.logs} loading={this.state.logs_loading} pagination={this.state.logs_pagination} rowKey={(row) => row.id} />
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
                            <Table columns={missionColumns} dataSource={this.state.missions} loading={this.state.mission_loading} pagination={this.state.mission_pagination} rowKey={(row) => row.id} />
                        </Card>
                    </Col>
                </Row>
                <MissionModal ref={this.missionModal} refresh={this.refreshMissions} siteId={this.state.site.id} />
                <LogModal ref={this.logModal} />
            </div>
        );
    }
}

class MissionModal extends React.Component {
    constructor(props) {
        super(props);
        this.form = React.createRef();
    }
    state = {
        mode: 'add',
        visible: false,
        // 表单初始值
        name: '',
        desc: '',
        startTime: null,
        endTime: null,
    };
    show = (mode, record) => {
        this.setState(
            {
                mode: mode,
                visible: true,
                name: record ? record.name : '',
                desc: record ? record.description : '',
                startTime: record ? moment(record.startTime) : null,
                endTime: record ? moment(record.endTime) : null,
            },
            () => {
                if (this.form.current) {
                    this.form.current.resetFields();
                }
            }
        );
    };
    submitForm = () => {
        this.form.current.submit();
    };
    formFinish = (values) => {
        values.startTime = values.startTime.format('YYYY-MM-DD') + ' 00:00:00';
        values.endTime = values.endTime.format('YYYY-MM-DD') + ' 23:59:59';
        axios
            .post('/mission/create', {
                siteId: this.props.siteId,
                ...values,
            })
            .then(
                (res) => {
                    if (res.data.code === 200) {
                        this.setState({
                            visible: false,
                        });
                        message.success('创建成功');
                        if (typeof this.props.refresh === 'function') {
                            this.props.refresh();
                        }
                    } else {
                        message.error(res.data.message);
                    }
                },
                (err) => {
                    console.error(err);
                    message.error('与服务器通讯失败');
                }
            );
    };
    render() {
        const disabledDateBefore = (current) => {
            return current && current < moment().startOf('day');
        };
        const disabledDateAfter = (current) => {
            let startTime = this.form.current.getFieldValue('startTime');
            return current && current < (startTime ? startTime.endOf('day') : moment().endOf('day'));
        };
        return (
            <Modal
                title={this.state.mode === 'add' ? '添加任务' : '编辑任务'}
                visible={this.state.visible}
                onOk={this.submitForm}
                onCancel={() => {
                    this.setState({ visible: false });
                }}
            >
                <Form
                    {...formLayout}
                    ref={this.form}
                    name="mission"
                    labelAlign="left"
                    onFinish={this.formFinish}
                    initialValues={{
                        name: this.state.name,
                        desc: this.state.desc,
                        startTime: this.state.startTime,
                        endTime: this.state.endTime,
                    }}
                >
                    <Form.Item
                        name="name"
                        label="名称"
                        rules={[
                            {
                                required: true,
                                message: '请输入任务名称',
                            },
                            {
                                max: 30,
                                message: '任务名称不能超过30个字符',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="desc"
                        label="描述"
                        rules={[
                            {
                                max: 200,
                                message: '任务描述不能超过200个字符',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="startTime" label="起始日期">
                        <DatePicker format="YYYY-MM-DD" disabledDate={disabledDateBefore} />
                    </Form.Item>
                    <Form.Item name="endTime" label="结束日期">
                        <DatePicker format="YYYY-MM-DD" disabledDate={disabledDateAfter} />
                    </Form.Item>
                </Form>
            </Modal>
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
            right: 20,
        };
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

export default connect(mapState, mapDispatch)(SiteDetailPage);
