import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import Icon from '../common/icon';

class Nav extends React.Component {
    state = {
        activeKey: ''
    }
    renderMenu = (data, noIcon = false, parentPath = null)=>{
        return data.map((item)=>{
            if(item.children && !item.noSubmenu){
                return (
                    <Menu.SubMenu title={
                        <span>
                        {noIcon ? null : item.icon ? <Icon type={item.icon}></Icon> : null}
                            <span>{item.title}</span>
                        </span>
                    } key={item.path}>
                        {this.renderMenu(item.children, true, item.path)}
                    </Menu.SubMenu>
                )
            }
            let path = parentPath ? parentPath + item.path : '/app' + item.path;
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
        if (path.endsWith('/')) {
            path = path.substring(0, path.length - 1);
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

export default Nav;