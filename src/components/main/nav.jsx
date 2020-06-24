import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Icon from '../common/icon';

const mapState = (state) => ({
    user: state.user,
});

class Nav extends React.Component {
    state = {
        activeKey: ''
    }
    renderMenu = (data, noIcon = false, parentPath = null)=>{
        return data.map((item)=>{
            if (item.auth) {
                if (item.auth === 'user') {
                    if (!this.props.user.role || this.props.user.role.name === 'guset') {
                        return null;
                    }
                } else if (item.auth === 'admin') {
                    if (!this.props.user.role || this.props.user.role.name !== 'admin') {
                        return null;
                    }
                }
            }
            let path = parentPath ? parentPath + item.path : '/app' + item.path;
            if(item.children && !item.noSubmenu){
                return (
                    <Menu.SubMenu title={
                        <span>
                        {noIcon ? null : item.icon ? <Icon type={item.icon}></Icon> : null}
                            <span>{item.title}</span>
                        </span>
                    } key={path}>
                        {this.renderMenu(item.children, true, path)}
                    </Menu.SubMenu>
                )
            }
            return (
                <Menu.Item title={item.title} key={path}>
                    <Link to={path}>
                        {noIcon ? null : item.icon ? <Icon type={item.icon}></Icon> : null}<span>{item.title}</span>
                    </Link>
                </Menu.Item>
            )
        });
    }
    handleClick = e => {
        this.setState({
            activeKey: e.key
        });
    }
    componentDidMount() {
        let path = window.location.pathname;
        if (path.includes('/app/sites')) {
            path = '/app/sites';
        } else {
            if (path.endsWith('/')) {
                path = path.substring(0, path.length - 1);
            }
        }
        this.setState({
            activeKey: path,
        });
    }
    render() {
        return (
            <Menu mode="inline" theme="dark"
                selectedKeys ={[this.state.activeKey]}
                onClick={this.handleClick}>
                {this.renderMenu(this.props.routes)}
            </Menu>
        )
    }
}

export default connect(mapState, null)(Nav);