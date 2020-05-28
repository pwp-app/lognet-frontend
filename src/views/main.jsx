import React from 'react';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Route, Switch, Redirect } from 'react-router-dom';
import Nav from '../components/main/nav';
import BreadCrumb from '../components/main/breadcrumb';
import User from '../components/main/user';
import routes from '../routes/pages';
import NotFoundPage from './404';

const { Header, Footer, Sider, Content } = Layout;

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
            let path = parentPath ? parentPath + route.path : route.path;
            return <Route exact key={path} path={path} component={route.component} />;
        });
    };
    render() {
        return (
            <Layout className="container-main" style={{ minHeight: '100vh' }}>
                <Sider className="site-nav" trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="nav-title">
                        <span>Antd{this.state.collapsed ? '' : ' Platform'}</span>
                    </div>
                    <Nav />
                </Sider>
                <Layout className="container-main-pages">
                    <Header className="site-background site-header" style={{ padding: 0 }}>
                        <span className="collapse-trigger">
                            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'collapse-trigger-icon',
                                onClick: this.toggle,
                            })}
                        </span>
                        <div className="site-header-right">
                            <User />
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '0 24px',
                        }}
                    >
                        <div className="content-header">
                            <Route component={BreadCrumb} />
                        </div>
                        <div className="site-background container-content">
                            <Switch>
                                {this.renderRoutes(routes)}
                                <Route exact path="/app/404" component={NotFoundPage} />
                                <Redirect to="/app/404" />
                            </Switch>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default MainLayout;
