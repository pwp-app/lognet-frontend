import React from 'react';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import Nav from '../components/main/nav';
import User from '../components/main/user';
import routes from '../routes/pages';
import NotFoundPage from './404';
import BreadCrumbPart from '../components/main/breadcrumb';
import logo from '../assets/image/lognet.png';

const { Sider, Header, Content } = Layout;

class MainLayout extends React.Component {
    state = {
        collapsed: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    renderRoutes = (routes, parentPath) => {
        return routes.map((route) => {
            if (route.children) {
                return this.renderRoutes(route.children, route.path);
            }
            let path = parentPath ? parentPath + route.path : '/app' + route.path;
            return <Route exact key={path} path={path} component={route.component} />;
        });
    };
    render() {
        return (
            <BrowserRouter>
                <Layout className="container-main" style={{ minHeight: '100vh' }}>
                    <Sider className="site-layout-background site-nav" trigger={null} collapsible collapsed={this.state.collapsed}>
                        <div className="nav-title">
                            <img src={logo} alt="logo"/>
                            {this.state.collapsed ? null : <span>Lognet</span>}
                        </div>
                        <Nav routes={routes} />
                    </Sider>
                    <Layout className="container-main-pages">
                        <Header className="site-layout-background site-header" style={{ padding: 0 }}>
                            <div className="site-header-left">
                                <span className="collapse-trigger">
                                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                        className: 'collapse-trigger-icon',
                                        onClick: this.toggle,
                                    })}
                                </span>
                                <BreadCrumbPart routes={routes} />
                            </div>
                            <div className="site-header-right">
                                <User />
                            </div>
                        </Header>
                        <Content className="site-content">
                            <Switch>
                                {this.renderRoutes(routes)}
                                <Route exact path="/app/404" component={NotFoundPage} />
                                <Redirect to="/app/404" />
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </BrowserRouter>
        );
    }
}

export default MainLayout;
