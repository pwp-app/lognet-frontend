import React from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
// routes
import routes from './site';

class Routes extends React.Component {
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
        const { location } = this.props;
        return (
            <TransitionGroup className={'router-wrapper'}>
                <CSSTransition classNames={'fade'} key={location.pathname} appear={true} timeout={300} unmountOnExit={true}>
                    <Switch location={location}>
                        {this.renderRoutes(routes)}
                        <Redirect to="/404" />
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
        );
    }
}

export default withRouter(Routes);
