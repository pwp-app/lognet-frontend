import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
// routes
import routes from './site';
import MainLayout from '../views/main';

const mapState = state => ({
    logout: state.logout
});

class Routes extends React.Component {
    renderRoutes = (routes, parentPath) => {
        return routes.map((route) => {
            if (route.children) {
                return this.renderRoutes(route.children, route.path);
            }
            let path = parentPath ? parentPath + route.path : route.path;
            return <Route exact key={path} path={path} component={route.component} />;
        });
    }
    render() {
        const { location } = this.props;
        return (
            <TransitionGroup>
                <CSSTransition classNames="fade" appear={true} key={location.pathname} timeout={300} unmountOnExit>
                    <Switch location={location}>
                        { this.renderRoutes(routes) }
                        { this.props.logout ? <Redirect to="/portal"/> : null }
                        <Route key="/app" path="/app" component={MainLayout}></Route>
                        <Redirect to="/404" />
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        );
    }
}

export default connect(mapState, null)(withRouter(Routes));
