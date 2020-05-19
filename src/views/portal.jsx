import React from 'react';
import { Form, Input, Button } from 'antd';
import { withRouter } from 'react-router-dom';
import logo from '../assets/image/lognet.png';

// form layouts
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

class PortalPage extends React.Component {
    state = {
        formType: 'login',
    }
    switchRegister = () => {
        this.setState({
            formType: 'register',
        });
    }
    switchLogin = () => {
        this.setState({
            formType: 'login'
        });
    }
    backHome = () => {
        this.props.history.push('/');
    }
    render() {
        return (
            <div className="page page-portal">
                <div className="container container-portal">
                    <div className="portal-title">
                        <div className="portal-title-logo">
                            <img src={logo} alt="Lognet"/>
                        </div>
                        <div className="portal-title-text">
                            { this.state.formType === 'login' ? '登录' : '注册'}
                        </div>
                    </div>
                    <div className="portal-form">
                        {
                            this.state.formType === 'login' ?
                            <LoginForm switch={this.switchRegister} /> :
                            <RegisterForm switch={this.switchLogin} />
                        }
                    </div>
                    <div className="portal-back" onClick={this.backHome}>
                        <span>&lt;-&nbsp;&nbsp;返回主页</span>
                    </div>
                </div>
            </div>
        )
    }
}

class LoginForm extends React.Component {
    onFinish = (values) => {

    }
    onFinishFailed = () => {

    }
    render() {
        return (
            <Form
                {...layout}
                name="login"
                labelAlign="left"
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{ required: true, message: '请输入您的用户名' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入您的密码' }]}
                >
                    <Input.Password />
                </Form.Item>
                <div className="portal-form-action">
                    <Button size="large" shape="round" onClick={this.props.switch}>点我注册</Button>
                    <Button type="primary" size="large" shape="round">登录</Button>
                </div>
            </Form>
        )
    }
}

class RegisterForm extends React.Component {
    render() {
        return (
            <Form
                {...layout}
                name="register"
                labelAlign="left"
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                >
                <Form.Item
                    label="用户名"
                    name="username"
                    rules={[{required: true, message: '请输入用户名'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                    label="密码"
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="确认密码"
                    name="confirmPassword"
                    rules={[{ required: true, message: '请再次输入密码' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="邮箱"
                    name="email"
                    rules={[{ required: true, message: '请输入您的邮箱' }]}
                >
                    <Input.Password />
                </Form.Item>
                <div className="portal-form-action">
                    <Button size="large" shape="round" onClick={this.props.switch}>返回登录</Button>
                    <Button type="primary" size="large" shape="round">注册</Button>
                </div>
            </Form>
        )
    }
}

export default withRouter(PortalPage);