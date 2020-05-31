import React from 'react';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Nav from '../components/main/nav';
import User from '../components/main/user';
import routes from '../routes/pages';
import NotFoundPage from './404';
import BreadCrumbPart from '../components/main/breadcrumb';
import logo from '../assets/image/lognet.png';
// utils
import axios from '../utils/axios';

const { Sider, Header, Content } = Layout;

const mapState = state => ({
    user: state.user,
});

const mapDispatch = ({ user: { setUser }}) => ({
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
        let res = await axios.get('/user/fetchInfo');
        if (res.status === 200 && res.data && res.data.code === 200 && res.data.data) {
            this.props.setUser(res.data.data);
        }
        this.setState({
            userInfoFetched: true,
        });
    }
    renderRoutes = (routes, parentPath) => {
        return routes.map((route) => {
            if (route.children) {
                return this.renderRoutes(route.children, route.path);
            }
            let path = parentPath ? parentPath + route.path : '/app' + route.path;
            // Guard
            if (route.auth) {
                if (route.auth === 'user') {
                    if (!this.props.user.role || this.props.user.role.name !== 'user') {
                        return null;
                    }
                } else if (route.auth === 'admin') {
                    if (!this.props.user.role || this.props.user.role.name !== 'admin') {
                        return null;
                    }
                }
            }
            return <Route exact key={path} path={path} component={route.component} />;
        });
    }
    async componentDidMount() {
        await this.fetchUserInfo();
    }
    render() {
        if (!this.state.userInfoFetched) {
            return null;
        }
        if (!this.props.user || !this.props.user.role || this.props.user.role.name !== 'user') {
            return (<Redirect to="/404" />);
        }
        return (
            <BrowserRouter>
                <Layout className="container-main" style={{ minHeight: '100vh' }}>
                    <Sider className="site-layout-background site-nav" trigger={null} collapsible collapsed={this.state.collapsed}>
                        <div className={['nav-title', this.state.collapsed ? 'nav-title-collapsed' : null].join(' ')}>
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

export default connect(mapState, mapDispatch)(MainLayout);
