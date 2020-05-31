import React from 'react';
import { Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import MD5 from 'crypto-js/md5';

const menu = (
    <Menu>
        <Menu.Item>
            <SettingOutlined />
            <span>用户设置</span>
        </Menu.Item>
        <Menu.Item>
            <LogoutOutlined />
            <span>退出登录</span>
        </Menu.Item>
    </Menu>
);

const mapState = state => ({
    user: state.user,
});

class UserDropdown extends React.Component {
    render() {
        const email_hash = this.props.user.email ? MD5(this.props.user.email) : null;
        return (
            <Dropdown overlay={menu}>
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

export default connect(mapState, null)(UserDropdown);