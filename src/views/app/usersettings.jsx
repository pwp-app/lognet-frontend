import React from 'react';
import { Row, Col, Card, Table, Modal, message, Input, Form } from 'antd';
import { connect } from 'react-redux';
import SettingCard from '../../components/main/settingcard';
import SettingIconCard from '../../components/main/settingiconcard';
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
    }
    state = {
        recentLogs: [],
        changeBindVisible: false,
        modPasswordVisible: false,
        tableLoading: true,
    };
    openGravatar = () => {
        window.open('https://en.gravatar.com/emails/');
    };
    // mod password
    modPasswordOk = () => {
        this.modPasswordForm.current.submit();
    }
    modPasswordSubmit = (values) => {
        values.oldPassword = sha256(values.oldPassword).toString();
        values.newPassword = sha256(values.newPassword).toString();
        values.newConfirmPassword = sha256(values.newConfirmPassword).toString();
        axios.post('/user/changePassword', values).then((res) => {
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
        }, () => {
            message.error('提交失败');
        });
    }
    componentDidMount = () => {
        axios
            .get('/user/fetchLoginLog')
            .then((res) => {
                if (res.data && res.data.code === 200) {
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
            }, () => {
                this.setState({
                    tableLoading: false,
                });
                message.error('获取登录记录失败');
            });
    };
    render() {
        return (
            <div className="page-us">
                <Row gutter={[18, 18]}>
                    <Col span={12}>
                        <SettingCard
                            title="邮箱设置"
                            content={
                                <>
                                    <p>您当前绑定的邮箱为：</p>
                                    <p>{this.props.user.email}</p>
                                </>
                            }
                            actionName="更换绑定"
                        />
                    </Col>
                    <Col span={12}>
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
                    <Col span={12}>
                        <SettingIconCard
                            icon="LockFilled"
                            title="修改密码"
                            content={<p>我们建议您定期修改密码来提升帐号的安全保护强度</p>}
                            action={() => {
                                this.setState({
                                    modPasswordVisible: true,
                                });
                            }}
                            actionName="立即修改"
                        />
                    </Col>
                    <Col span={12}></Col>
                    <Col span={24}>
                        <Card className="card-table us-card-logs" title="最近 10 次登录记录">
                            <Table dataSource={this.state.recentLogs} columns={logTableColumns} pagination={false} loading={this.state.tableLoading} rowKey={row=>row.createTime}/>
                        </Card>
                    </Col>
                </Row>
                <Modal
                    title="更改绑定邮箱"
                    visible={this.state.changeBindVisible}
                    >

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
