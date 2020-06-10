import React from 'react';
import { Row, Col, Card, Table, Modal, message, Input, Form } from 'antd';
import { connect } from 'react-redux';
import SettingCard from '../../components/main/settingcard';
import axios from '../../utils/axios';
import sha256 from 'crypto-js/sha256';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const mapState = (state) => ({
    user: state.user,
});
const mapDispatch = ({ user: { setUser, setEmail } }) => ({
    setUser: (user) => setUser(user),
    setEmail: (email) => setEmail(email),
});

const logTableColumns = [
    {
        title: '登录时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
    {
        title: '登录IP',
        dataIndex: 'ip',
        key: 'ip',
    },
    {
        title: '登陆地点',
        dataIndex: 'geo',
        key: 'geo',
    },
];

class UserSettingsPage extends React.Component {
    constructor(props) {
        super(props);
        this.modPasswordForm = React.createRef();
        this.changeBindForm = React.createRef();
        this.mailValidateForm = React.createRef();
    }
    state = {
        recentLogs: [],
        changeBindVisible: false,
        mailValidateVisible: false,
        modPasswordVisible: false,
        tableLoading: true,
    };
    openGravatar = () => {
        window.open('https://en.gravatar.com/emails/');
    };
    // fetch user info
    fetchInfo = () => {
        axios.get('/user/fetchInfo').then((res) => {
            if (res.data.code === 200) {
                this.props.setUser(res.data.data);
            }
        });
    };
    // mod password
    modPasswordOk = () => {
        this.modPasswordForm.current.submit();
    };
    modPasswordSubmit = (values) => {
        values.oldPassword = sha256(values.oldPassword).toString();
        values.newPassword = sha256(values.newPassword).toString();
        values.newConfirmPassword = sha256(values.newConfirmPassword).toString();
        axios.post('/user/changePassword', values).then(
            (res) => {
                if (res.data.code === 200) {
                    message.success('修改成功，请使用密码重新登录');
                    this.setState({
                        modPasswordVisible: false,
                    });
                    // 置为初始态
                    this.props.setUser(null);
                    this.props.history.push('/portal');
                } else {
                    message.error(res.data.message);
                }
            },
            () => {
                message.error('提交失败');
            }
        );
    };
    submitChangeBind = () => {
        this.changeBindForm.current.submit();
    };
    changeBindSubmit = (values) => {
        values.password = sha256(values.password).toString();
        axios.post('/user/changeBind', values).then(
            (res) => {
                if (res.data.code === 200) {
                    message.success('您的新邮箱将会收到一个验证码');
                    this.setState(
                        {
                            changeBindVisible: false,
                            mailValidateVisible: true,
                            newMail: values.newMail,
                        }
                    );
                    if (this.mailValidateForm.current) {
                        this.mailValidateForm.current.resetFields();
                    }
                } else {
                    message.error(res.data.message);
                }
            },
            () => {
                message.error('与服务器通讯失败');
            }
        );
    };
    submitMailValidate = () => {
        this.mailValidateForm.current.submit();
    };
    mailValidateSubmit = (values) => {
        axios
            .post('/user/bindValidate', {
                code: values.code,
                mail: this.state.newMail,
            })
            .then(
                (res) => {
                    if (res.data.code === 200) {
                        message.success('绑定成功');
                        this.setState({
                            mailValidateVisible: false,
                        });
                        this.fetchInfo();
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
        axios.get('/user/fetchLoginLog').then(
            (res) => {
                if (res.data.code === 200) {
                    let data = res.data.data;
                    for (let item of data) {
                        item.key = item.createTime;
                    }
                    this.setState({
                        recentLogs: data,
                        tableLoading: false,
                    });
                } else {
                    this.setState({
                        tableLoading: false,
                    });
                    message.error('获取登录记录失败');
                }
            },
            () => {
                this.setState({
                    tableLoading: false,
                });
                message.error('获取登录记录失败');
            }
        );
    };
    render() {
        return (
            <div className="page-us">
                <Row gutter={[18, 18]}>
                    <Col span={8}>
                        <SettingCard
                            title="修改密码"
                            content={
                                <>
                                    <p>我们建议您定期修改密码来提升帐号的安全保护强度</p>
                                    <p>请尽可能使用较强的密码来保护您的账号</p>
                                </>
                            }
                            action={() => {
                                this.setState({
                                    modPasswordVisible: true,
                                });
                                if (this.modPasswordForm.current) {
                                    this.modPasswordForm.current.resetFields();
                                }
                            }}
                            actionName="立即修改"
                        />
                    </Col>
                    <Col span={8}>
                        <SettingCard
                            title="邮箱设置"
                            content={
                                <>
                                    <p>您当前绑定的邮箱为：</p>
                                    <p>{this.props.user.email}</p>
                                </>
                            }
                            action={() => {
                                this.setState({
                                    changeBindVisible: true,
                                });
                                if (this.changeBindForm.current) {
                                    this.changeBindForm.current.resetFields();
                                }
                            }}
                            actionName="更换绑定"
                        />
                    </Col>
                    <Col span={8}>
                        <SettingCard
                            title="头像设置"
                            content={
                                <>
                                    <p>我们将根据您绑定的邮箱来获取您的头像，</p>
                                    <p>如果您需要设置您的头像，需要前往 Gravatar 进行设置。</p>
                                </>
                            }
                            action={this.openGravatar}
                            actionName="立即前往"
                        />
                    </Col>
                    <Col span={24}>
                        <Card className="card-table us-card-logs" title="最近 10 次登录记录">
                            <Table dataSource={this.state.recentLogs} columns={logTableColumns} pagination={false} loading={this.state.tableLoading} rowKey={(row) => row.createTime} />
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title="更改绑定邮箱"
                    visible={this.state.changeBindVisible}
                    onOk={this.submitChangeBind}
                    onCancel={() => {
                        this.setState({ changeBindVisible: false });
                    }}
                >
                    <Form {...layout} ref={this.changeBindForm} name="changeBind" labelAlign="left" onFinish={this.changeBindSubmit}>
                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入帐号的密码',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="newMail"
                            label="新邮箱"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入要绑定的新邮箱',
                                },
                                {
                                    pattern: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/,
                                    message: '请输入正确的邮箱地址',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal title="邮箱验证" name="mailValidate" visible={this.state.mailValidateVisible} onOk={this.submitMailValidate} onCancel={() => this.setState({ mailValidateVisible: false })}>
                    <Form {...layout} ref={this.mailValidateForm} name="mailValidate" labelAlign="left" onFinish={this.mailValidateSubmit}>
                        <Form.Item
                            name="code"
                            label="验证码"
                            rules={[
                                {
                                    required: true,
                                    message: '请填写验证码',
                                },
                                {
                                    pattern: /^\d{6}$/,
                                    message: '请填写正确的验证码',
                                    validateTrigger: 'blur',
                                },
                            ]}
                            getValueFromEvent={(e) => {
                                return e.target.value.replace(/\D/g, '');
                            }}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="修改密码"
                    visible={this.state.modPasswordVisible}
                    onOk={this.modPasswordOk}
                    onCancel={() => {
                        this.setState({ modPasswordVisible: false });
                    }}
                >
                    <Form {...layout} ref={this.modPasswordForm} name="modPassword" labelAlign="left" onFinish={this.modPasswordSubmit}>
                        <Form.Item
                            name="oldPassword"
                            label="旧密码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入旧密码',
                                },
                            ]}
                        >
                            <Input.Password placeholder="请输入旧密码" />
                        </Form.Item>
                        <Form.Item
                            name="newPassword"
                            label="新密码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入新密码',
                                },
                                {
                                    min: 6,
                                    message: '密码不能少于6个字符',
                                },
                            ]}
                        >
                            <Input.Password placeholder="请输入新密码" />
                        </Form.Item>
                        <Form.Item
                            name="newConfirmPassword"
                            label="确认密码"
                            rules={[
                                {
                                    required: true,
                                    message: '请再次输入密码',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('两次输入的密码不一致');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="请输入确认密码" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(UserSettingsPage);
