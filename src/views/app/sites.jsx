import React from 'react';
import { Row, Col, Card, Table, Button, Popconfirm, message, Modal, Form, Input } from 'antd';
import { EditFilled, DeleteFilled, EyeFilled } from '@ant-design/icons';
import { connect } from 'react-redux';
import IconCard from '../../components/main/iconcard';
import axios from '../../utils/axios';

const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const mapDispatch = ({ site: { setSite } }) => ({
    setSite: (site) => setSite(site),
});

class SiteModal extends React.Component {
    constructor(props) {
        super(props);
        this.form = React.createRef();
    }
    state = {
        mode: 'add',
        visible: false,
        // 表单初始值
        domain: '',
        desc: '',
    };
    show = (mode, record) => {
        this.setState(
            {
                mode: mode,
                visible: true,
                domain: record ? record.domain : '',
                desc: record ? record.description : '',
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
        if (this.state.mode === 'add') {
            axios.post('/site/add', values).then(
                (res) => {
                    if (res.data.code === 200) {
                        this.setState({
                            visible: false,
                        });
                        message.success('创建成功');
                        this.props.refresh();
                    } else {
                        message.error(res.data.message);
                    }
                },
                (err) => {
                    console.error(err);
                    message.error('与服务器通讯失败');
                }
            );
        } else if (this.state.mode === 'edit') {
            axios
                .post('/site/edit', {
                    id: this.currentId,
                    desc: values.desc,
                })
                .then(
                    (res) => {
                        if (res.data.code === 200) {
                            this.setState({
                                visible: false,
                            });
                            this.props.fetch();
                        } else {
                            message.error(res.data.message);
                        }
                    },
                    () => {
                        message.error('与服务器通讯失败');
                    }
                );
        }
    };
    render() {
        return (
            <Modal
                title={this.state.mode === 'add' ? '添加站点' : '编辑站点'}
                visible={this.state.visible}
                onOk={this.submitForm}
                onCancel={() => {
                    this.setState({ visible: false });
                }}
            >
                <Form
                    {...formLayout}
                    ref={this.form}
                    name="site"
                    labelAlign="left"
                    onFinish={this.formFinish}
                    initialValues={{
                        domain: this.state.domain,
                        desc: this.state.desc,
                    }}
                >
                    <Form.Item
                        name="domain"
                        label="域名"
                        rules={[
                            {
                                required: true,
                                message: '请输入域名',
                            },
                            {
                                pattern: /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/,
                                message: '请输入正确的域名',
                            },
                        ]}
                    >
                        <Input placeholder="例如：pwp.app" disabled={this.state.mode !== 'add'} />
                    </Form.Item>
                    <Form.Item
                        name="desc"
                        label="描述"
                        rules={[
                            {
                                max: 100,
                                message: '描述不能超过100个字符',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

class SitesPage extends React.Component {
    constructor(props) {
        super(props);
        this.siteModal = React.createRef();
    }
    state = {
        stats: {
            total: 0,
            recentGeneralLog: 0,
            recentMissionLog: 0,
        },
        sites: null,
        sites_pagination: {
            page: 1,
            pageSize: 10,
        },
        sites_loading: true,
    };
    refreshTable = () => {
        this.setState({
            sites_loading: true,
        });
        this.fetch(this.state.sites_pagination);
    };
    fetch = (pagination) => {
        axios
            .get('/site/list', {
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
                    } else {
                        this.setState({
                            sites_loading: false,
                        });
                        message.error('站点数据获取失败');
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
    fetchOverall = () => {
        axios.get('/site/fetchOverall').then((res) => {
            if (res.data.code === 200) {
                this.setState({
                    stats: res.data.data,
                });
            }
        });
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
    addSite = () => {
        this.siteModal.current.show('add');
    };
    deleteSite = (id) => {
        axios
            .post('/site/delete', {
                id,
            })
            .then(
                (res) => {
                    if (res.data.code === 200) {
                        message.success('删除成功');
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
    showEditModal = (record) => {
        this.siteModal.current.show('edit', record);
    };
    componentDidMount = () => {
        this.refreshTable();
        this.fetchOverall();
    };
    render() {
        const tableColumns = [
            {
                title: '域名',
                dataIndex: 'domain',
                key: 'domain',
                width: 280,
            },
            {
                title: '描述',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: '状态',
                dataIndex: 'enabled',
                key: 'state',
                width: 180,
                render: (value) => {
                    return value ? '正常' : '禁用中';
                },
            },
            {
                title: '操作',
                key: 'operation',
                width: 360,
                render: (_, record) => {
                    return (
                        <div className="button-group">
                            <Button
                                key={'btn_view_' + record.id}
                                icon={<EyeFilled />}
                                onClick={() => {
                                    this.props.setSite(record);
                                    this.props.history.push(`/app/sites/detail/${record.id}`);
                                }}
                            ></Button>
                            <Button
                                key={'btn_edit_' + record.id}
                                icon={<EditFilled />}
                                onClick={() => {
                                    this.showEditModal(record);
                                }}
                            ></Button>
                            <Popconfirm
                                placement="topRight"
                                key={'btn_delete' + record.id}
                                title="确定要删除吗？所有和该站点有关的数据都会被删除，且该操作不可逆"
                                okText="确定"
                                cancelText="取消"
                                onConfirm={() => {
                                    this.deleteSite(record.id);
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
            <div className="page-sites">
                <Row gutter={[16, 16]}>
                    <IconCard span={8} icon="CloudServerOutlined" desc="站点数" number={this.state.stats.total}></IconCard>
                    <IconCard span={8} icon="BugOutlined" desc="近7天错误日志提交量" number={this.state.stats.recentGeneralLog}></IconCard>
                    <IconCard span={8} icon="FileOutlined" desc="近7天任务日志提交量" number={this.state.stats.recentMissionLog}></IconCard>
                </Row>
                <Row>
                    <Col span={24}>
                        <Card
                            title="站点列表"
                            className="card-table"
                            extra={
                                <div className="button-group">
                                    <Button onClick={this.refreshTable}>刷新</Button>
                                    <Button type="primary" onClick={this.addSite}>
                                        添加
                                    </Button>
                                </div>
                            }
                        >
                            <Table dataSource={this.state.sites} columns={tableColumns} pagination={this.state.sites_pagination} loading={this.state.sites_loading} rowKey={(row) => row.id} handleTableChange={this.handleTableChange} />
                        </Card>
                    </Col>
                </Row>
                <SiteModal ref={this.siteModal} refresh={this.refreshTable} />
            </div>
        );
    }
}

export default connect(null, mapDispatch)(SitesPage);
