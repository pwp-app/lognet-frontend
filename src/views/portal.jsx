import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { withGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { connect } from 'react-redux';
import sha256 from 'crypto-js/sha256';
import axios from '../utils/axios';
import logo from '../assets/image/lognet.png';

// form layouts
const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
};

const tailLayout = {
    wrapperCol: { span: 24 },
};

const mapState = state => ({
    user: state.user,
});

const mapDispatch = ({ user: { setUser, setEmail }}) => ({
    setUser: (user) => setUser(user),
    setEmail: (email) => setEmail(email),
});

class PortalPage extends React.Component {
    state = {
        formType: 'login',
        token: '',
        validateFrom: '',
        validateMail: '',
        validateRetryTime: 0,
    };
    componentDidMount = () => {
        this.getToken();
    }
    getToken = async () => {
        this.setState({
            token: await this.props.googleReCaptchaProps.executeRecaptcha('login')
        });
    }
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
    checkValidate = (from) => {
        this.setState({
            validateFrom: from,
        });
        if (from === 'login') {
            // 已经不是Guest，不需要验证
            if (this.props.user.role && this.props.user.role.level !== 0) {
                return;
            }
        }
        // 注册默认都要验证
        this.getValidate();
    };
    getValidate = () => {
        this.setState({
            formType: 'validation',
            validateRetryTime: 60,
        });
        this.validateInterval = setInterval(() => {
            this.setState({
                validateRetryTime: this.state.validateRetryTime - 1,
            });
            if (this.state.validateRetryTime <= 0) {
                this.setState({
                    validateRetryTime: 0,
                });
                clearInterval(this.validateInterval);
            }
        }, 1000);
        axios
            .get('/portal/sendValidation', {
                params: {
                    email: this.props.user.email,
                },
            })
            .then((res) => {
                if (res.data.code !== 200) {
                    message.error(res.data.message);
                }
            })
            .catch(() => {
                message.error('连接错误，无法获取验证码');
                this.setState({
                    validateRetryTime: 0,
                });
                clearInterval(this.validateInterval);
            });
    };
    sendValidate = (code) => {
        axios
            .post('/portal/validate', {
                email: this.props.user.email,
                code,
            })
            .then((res) => {
                if (res.data.code === 200) {
                    if (this.state.from === 'login') {
                        // 验证成功，放行到主界面

                    } else if (this.state.from === 'register') {
                        message.success('验证成功，请输入您的凭据登录系统');
                        this.setState({
                            formType: 'login'
                        });
                    }
                }
            }).catch(() => {
                message.error('和服务器通讯失败');
            });
    };
    render() {
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
                                return <LoginForm switch={this.switchRegister} checkValidate={this.checkValidate} token={this.state.token} getToken={this.getToken}/>;
                            } else if (this.state.formType === 'register') {
                                return <RegisterForm switch={this.switchLogin} checkValidate={this.checkValidate} token={this.state.token} getToken={this.getToken}/>;
                            } else if (this.state.formType === 'validation') {
                                return <ValidationForm switch={this.state.validateFrom === 'login' ? this.switchLogin : this.switchRegister} retryTime={this.state.validateRetryTime} send={this.getValidate} validate={this.sendValidate} submit={this.sendValidate} />;
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
        buttonDisabled: false,
    };
    onFinish = async (values) => {
        values.password = sha256(values.password).toString();
        // 禁用登录按钮
        this.setState({
            buttonDisabled: true,
        });
        axios
            .post('/portal/login', {
                ...values,
                token: this.props.token,
            })
            .then((res) => {
                this.setState({
                    buttonDisabled: false,
                });
                if (res.data.code !== 200) {
                    message.error(res.data.message);
                    return;
                }
                // 登录成功
                if (res.data.data) {
                    this.props.setUser(res.data.data);
                    message.success('登录成功');
                    this.props.checkValidate('login');
                } else {
                    message.error('用户信息获取失败');
                }
            })
            .catch(() => {
                message.error('和服务器通讯失败');
                this.setState({
                    buttonDisabled: false,
                });
            });
        // 刷新Token，供下一次表单提交使用
        this.props.getToken();
    };
    submitForm = () => {
        this.form.current.submit();
    };
    render() {
        return (
            <Form {...layout} name="login" ref={this.form} labelAlign="left" onFinish={this.onFinish}>
                <Form.Item name="username" rules={[{ required: true, message: '请输入您的用户名' }]}>
                    <Input placeholder="用户名或邮箱" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: '请输入您的密码' }]}>
                    <Input.Password placeholder="密码" />
                </Form.Item>
                <Form.Item {...tailLayout} name="rememberMe" valuePropName="checked">
                    <Checkbox>30 天免登录</Checkbox>
                </Form.Item>
                <div className="portal-form-action">
                    <Button size="large" shape="round" onClick={this.props.switch}>
                        点我注册
                    </Button>
                    <Button type="primary" size="large" shape="round" onClick={this.submitForm} disabled={this.state.buttonDisabled}>
                        登录
                    </Button>
                </div>
            </Form>
        );
    }
}

const LoginForm = connect(null, mapDispatch)(LoginFormBuilder);

class RegisterFormBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.form = React.createRef();
    }
    state = {
        buttonDisabled: false,
    };
    onFinish = async (values) => {
        this.setState({
            buttonDisabled: true,
        });
        axios
            .post('/portal/register', {
                username: values.username,
                password: sha256(values.password).toString(),
                confirmPassword: sha256(values.confirmPassword).toString(),
                email: values.email,
                token: this.props.token,
            })
            .then((res) => {
                this.setState({
                    buttonDisabled: false,
                });
                if (res.data.code !== 200) {
                    message.error(res.data.message);
                    return;
                }
                message.success('注册成功');
                this.props.setEmail(values.email);
                this.props.checkValidate('register');
            })
            .catch((e) => {
                console.error(e);
                message.error('和服务器通讯失败');
                this.setState({
                    buttonDisabled: false,
                });
            });
        // 刷新Token，供下一次表单提交使用
        this.props.getToken();
    };
    submitForm = () => {
        this.form.current.submit();
    };
    render() {
        return (
            <Form {...layout} ref={this.form} name="register" labelAlign="left" onFinish={this.onFinish}>
                <Form.Item
                    name="username"
                    rules={[
                        { required: true, message: '请输入用户名' },
                        { pattern: /^[0-9A-Za-z_]+$/, message: '用户名只能由字母、数字、下划线组成' },
                        { min: 4, message: '用户名最少为4个字符' },
                        { max: 30, message: '用户名最多为30个字符' },
                    ]}
                >
                    <Input placeholder="用户名"/>
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: '请输入密码' },
                        {
                            min: 6,
                            message: '密码不能少于6个字符',
                        },
                    ]}
                >
                    <Input.Password placeholder="密码"/>
                </Form.Item>
                <Form.Item
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
                    <Input.Password placeholder="确认密码" />
                </Form.Item>
                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: '请输入您的邮箱' },
                        { pattern: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/, message: '请输入正确的邮箱地址' },
                    ]}
                >
                    <Input placeholder="电子邮箱"/>
                </Form.Item>
                <div className="portal-form-action">
                    <Button size="large" shape="round" onClick={this.props.switch}>
                        返回登录
                    </Button>
                    <Button type="primary" size="large" shape="round" onClick={this.submitForm} disabled={this.state.buttonDisabled}>
                        注册
                    </Button>
                </div>
            </Form>
        );
    }
}

const RegisterForm = connect(null, mapDispatch)(RegisterFormBuilder);

class ValidationForm extends React.Component {
    constructor(props) {
        super(props);
        this.form = React.createRef();
    }
    submit = () => {
        this.form.current.submit();
    };
    onFinish = (values) => {
        this.props.submit(values.code);
    };
    render() {
        return (
            <div className="portal-validate">
                <div className="portal-validate-text">
                    <p>我们已经向您的邮箱发送了验证码，</p>
                    <p>请在下方输入您收到的验证码：</p>
                </div>
                <div className="portal-validate-input">
                    <Form ref={this.form} layout="inline" onFinish={this.onFinish}>
                        <Form.Item
                            name="code"
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
                            <Input maxLength="6" />
                        </Form.Item>
                    </Form>
                    <Button type="primary" disabled={this.props.retryTime > 0} onClick={this.props.send}>
                        {this.props.retryTime <= 0 ? '重新发送' : `${this.props.retryTime} 秒`}
                    </Button>
                </div>
                <div className="portal-form-action">
                    <Button size="large" shape="round" onClick={this.props.switch}>
                        返回
                    </Button>
                    <Button type="primary" size="large" shape="round" onClick={this.submit}>
                        提交
                    </Button>
                </div>
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(withRouter(withGoogleReCaptcha(PortalPage)));
