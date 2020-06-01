import React from 'react';
import { Menu, Dropdown, Avatar, message } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from '../../utils/axios';
import MD5 from 'crypto-js/md5';

const mapState = state => ({
    user: state.user,
});

class UserDropdown extends React.Component {
    toUserSettings = () => {
        this.props.history.push('/app/user');
    }
    logout = () => {
        axios.get('/portal/logout').then((res) => {
            if (res.data && res.data.code === 200) {
                message.success('登出成功');
                this.props.history.push('/');
            } else {
                message.error('登出失败，' + res.data.message);
            }
        }).catch(() => {
            message.error('登出失败');
        });
    }
    menu = (
        <Menu>
            <Menu.Item onClick={this.toUserSettings}>
                <SettingOutlined />
                <span>用户设置</span>
            </Menu.Item>
            <Menu.Item onClick={this.logout}>
                <LogoutOutlined />
                <span>退出登录</span>
            </Menu.Item>
        </Menu>
    );
    render() {
        const email_hash = this.props.user.email ? MD5(this.props.user.email) : null;
        return (
            <Dropdown overlay={this.menu}>
                <div className="user-dropdown">
                    {
                        this.props.user.email ? <Avatar className="user-dropdown-avatar" src={`https://www.gravatar.com/avatar/${email_hash}?s=32`}/>: <Avatar className="user-dropdown-avatar" icon={<UserOutlined />} />
                    }
                    <span className="user-dropdown-name">{this.props.user.username ? this.props.user.username : 'UNDEFINED'}</span>
                </div>
            </Dropdown>
        );
    }
}

export default connect(mapState, null)(withRouter(UserDropdown));