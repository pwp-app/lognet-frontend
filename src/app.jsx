import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// routes
import routes from './routes/site';

class App extends React.Component {
    renderRoutes = (routes, parentPath) => {
        return routes.map((route) => {
            if (route.children) {
                return this.renderRoutes(route.children, route.path);
            }
            let path = parentPath ? parentPath + route.path : route.path;
            return <Route key={path} path={path} component={route.component}/>;
        })
    }

    render() {
        return (
            <div className="app">
                <BrowserRouter>
                    <Switch>
                        { this.renderRoutes(routes) }
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;