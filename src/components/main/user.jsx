import React from 'react';
import { Menu, Dropdown, Avatar } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

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

class UserDropdown extends React.Component {
    render() {
        return (
            <Dropdown overlay={menu}>
                <div className="user-dropdown">
                    <Avatar className="user-dropdown-avatar" icon={<UserOutlined />} />
                    <span className="user-dropdown-name">admin</span>
                </div>
            </Dropdown>
        );
    }
}

export default UserDropdown;