import React from 'react';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Route, Switch, Redirect, BrowserRouter, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import Nav from '../components/main/nav';
import User from '../components/main/user';
import routes from '../routes/pages';
import NotFoundPage from './app/notfound';
import BreadCrumbPart from '../components/main/breadcrumb';
// utils
import axios from '../utils/axios';

const { Sider, Header, Content } = Layout;

const mapState = (state) => ({
    user: state.user,
});

const mapDispatch = ({ user: { setUser } }) => ({
    setUser: (user) => setUser(user),
});

class MainLayout extends React.Component {
    state = {
        collapsed: false,
        userInfoFetched: false,
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    fetchUserInfo = async () => {
        let res;
        try {
            res = await axios.get('/user/fetchInfo');
        } catch (err) {
            this.props.history.push('/portal');
            return;
        }
        if (res.data.code === 200 && res.data.data) {
            this.props.setUser(res.data.data);
            this.setState({
                userInfoFetched: true,
            });
        } else {
            this.props.history.push('/portal');
        }
    };
    renderRoutes = (routes, parentPath) => {
        let res = [];
        for (let route of routes) {
            // Guard
            if (route.auth) {
                if (route.auth === 'user') {
                    if (!this.props.user.role || this.props.user.role.name === 'guset') {
                        return null;
                    }
                } else if (route.auth === 'admin') {
                    if (!this.props.user.role || this.props.user.role.name !== 'admin') {
                        continue;
                    }
                }
            }
            let path = parentPath ? parentPath + route.path : '/app' + route.path;
            if (route.children) {
                res = res.concat(this.renderRoutes(route.children, path));
            }
            if (route.param) {
                path = path + route.param;
            }
            if (route.component) {
                res.push(<Route exact key={path} path={path} component={route.component} />);
            }
        }
        return res;
    };
    async componentDidMount() {
        await this.fetchUserInfo();
    }
    render() {
        if (!this.state.userInfoFetched) {
            return null;
        }
        if (!this.props.user || !this.props.user.role || this.props.user.role.name === 'guest') {
            return <Redirect to="/404" />;
        }
        return (
            <BrowserRouter>
                <Layout className="container-main" style={{ minHeight: '100vh' }}>
                    <Sider className="site-layout-background site-nav" trigger={null} collapsible collapsed={this.state.collapsed}>
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
                            <TransitionGroup>
                                <CSSTransition classNames="fade" key={this.props.location.pathname} timeout={300} unmountOnExit>
                                    <Switch>
                                        {this.renderRoutes(routes)}
                                        <Route exact path="/app/404" component={NotFoundPage} />
                                        <Redirect to="/app/404" />
                                    </Switch>
                                </CSSTransition>
                            </TransitionGroup>
                        </Content>
                    </Layout>
                </Layout>
            </BrowserRouter>
        );
    }
}

export default connect(mapState, mapDispatch)(withRouter(MainLayout));
