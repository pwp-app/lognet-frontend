import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { withGoogleReCaptcha } from 'react-google-recaptcha-v3';
import sha256 from 'crypto-js/sha256';
import axios from '../utils/axios';
import logo from '../assets/image/lognet.png';

// form layouts
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
};

class PortalPage extends React.Component {
    state = {
        formType: 'validation',
        validateMail: '',
        validateRetryTime: 0,
    };
    switchRegister = () => {
        this.setState({
            formType: 'register',
        });
    };
    switchLogin = () => {
        this.setState({
            formType: 'login',
        });
    };
    backHome = () => {
        this.props.history.push('/');
    };
    needValidate = () => {};
    getValidate = (email) => {
        axios
            .get('/portal/sendValidation', {
                params: {
                    email,
                },
            })
            .then((res) => {});
    };
    sendValidate = (email, code) => {
        axios
            .post('/portal/validate', {
                email,
                code,
            })
            .then((res) => {});
    };
    render() {
        const LoginForm = withGoogleReCaptcha(LoginFormBuilder);
        const RegisterForm = withGoogleReCaptcha(RegisterFormBuilder);
        return (
            <div className="page page-portal">
                <div className="container container-portal">
                    <div className="portal-title">
                        <div className="portal-title-logo">
                            <img src={logo} alt="Lognet" />
                        </div>
                        <div className="portal-title-text">
                            {(() => {
                                if (this.state.formType === 'login') {
                                    return '登录';
                                } else if (this.state.formType === 'register') {
                                    return '注册';
                                } else if (this.state.formType === 'validation') {
                                    return '验证';
                                }
                            })()}
                        </div>
                    </div>
                    <div className="portal-form">
                        {(() => {
                            if (this.state.formType === 'login') {
                                return <LoginForm switch={this.switchRegister} />;
                            } else if (this.state.formType === 'register') {
                                return <RegisterForm switch={this.switchLogin} />;
                            } else if (this.state.formType === 'validation') {
                                return <ValidationForm switch={this.switchLogin} retryTime={this.state.retryTime} send={this.getValidate} validate={this.sendValidate} />;
                            }
                        })()}
                    </div>
                    <div className="portal-back" onClick={this.backHome}>
                        <span>&lt;-&nbsp;&nbsp;返回主页</span>
                    </div>
                    <div className="portal-recaptcha">
                        <p>站点由 reCAPTCHA 提供保护</p>
                        <p>
                            (&nbsp;&nbsp;
                            <a target="_blank" rel="noopener noreferrer" href="https://policies.google.com/privacy?hl=zh-CN">
                                隐私政策
                            </a>
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <a target="_blank" rel="noopener noreferrer" href="https://policies.google.com/terms?hl=zh-CN">
                                使用条款
                            </a>
                            &nbsp;&nbsp;)
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

class LoginFormBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.form = React.createRef();
    }
    state = {
        loginButtonDisabled: false,
    };
    onFinish = async (values) => {
        values.password = sha256(values.password).toString();
        // 禁用登录按钮
        this.setState({
            loginButtonDisabled: true,
        });
        axios
            .post('/portal/login', {
                ...values,
                token: await this.props.googleReCaptchaProps.executeRecaptcha('login'),
            })
            .then((res) => {
                this.setState({
                    loginButtonDisabled: false,
                });
                if (res.data.code !== 200) {
                    message.error(res.data.message);
                    return;
                }
                // 登录成功
            })
            .catch(() => {
                message.error('网络连接失败');
                this.setState({
                    loginButtonDisabled: false,
                });
            });
    };
    submitForm = () => {
        this.form.current.submit();
    };
    render() {
        return (
            <Form {...layout} name="login" ref={this.form} labelAlign="left" onFinish={this.onFinish}>
                <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入您的用户名' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入您的密码' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item {...tailLayout} name="rememberMe" valuePropName="checked">
                    <Checkbox>30 天免登录</Checkbox>
                </Form.Item>
                <div className="portal-form-action">
                    <Button size="large" shape="round" onClick={this.props.switch}>
                        点我注册
                    </Button>
                    <Button type="primary" size="large" shape="round" onClick={this.submitForm} disabled={this.state.loginButtonDisabled}>
                        登录
                    </Button>
                </div>
            </Form>
        );
    }
}

class RegisterFormBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.form = React.createRef();
    }
    onFinish = (values) => {
        axios
            .post('/portal/register', {})
            .then(res => {
                
            })
            .catch(() => {
                message.error('网络连接失败');
                this.setState({
                    loginButtonDisabled: false,
                });
            });
    };
    submitForm = () => {
        this.form.current.submit();
    };
    render() {
        return (
            <Form {...layout} name="register" labelAlign="left" onFinish={this.onFinish}>
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[
                        { required: true, message: '请输入用户名' },
                        { pattern: /^[0-9A-Za-z_]+$/, message: '用户名只能由字母、数字、下划线组成' },
                        { min: 4, message: '用户名最少为4个字符' },
                        { max: 30, message: '用户名最多为30个字符' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="确认密码"
                    name="confirmPassword"
                    rules={[
                        { required: true, message: '请再次输入密码' },
                        ({ getFieldValue }) => ({
                            validator(rule, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('两次输入的密码不一致！');
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[
                        { required: true, message: '请输入您的邮箱' },
                        { pattern: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/, message: '请输入正确的邮箱地址' },
                    ]}
                >
                    <Input />
                </Form.Item>
                <div className="portal-form-action">
                    <Button size="large" shape="round" onClick={this.props.switch}>
                        返回登录
                    </Button>
                    <Button type="primary" size="large" shape="round" onClick={this.submitForm}>
                        注册
                    </Button>
                </div>
            </Form>
        );
    }
}

class ValidationForm extends React.Component {
    render() {
        return (
            <div class="portal-validate">
                <div class="portal-validate-text">
                    <p>我们已经向您的邮箱发送了验证码，</p>
                    <p>请在下方输入您收到的验证码：</p>
                </div>
                <div class="portal-validate-input">
                    <Input />
                    <Button type="primary" disabled={this.props.retryTime <= 0} onClick={this.props.send}>
                        {this.props.retryTime <= 0 ? '重新发送' : `${this.props.retryTime} 秒`}
                    </Button>
                </div>
                <div className="portal-form-action">
                    <Button size="large" shape="round" onClick={this.props.switch}>
                        返回登录
                    </Button>
                    <Button type="primary" size="large" shape="round" onClick={this.submitForm}>
                        提交
                    </Button>
                </div>
            </div>
        );
    }
}

export default withRouter(PortalPage);
