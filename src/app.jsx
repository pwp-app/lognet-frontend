import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import LandingPage from './views/landing';

class App extends React.Component {
    render() {
        return (
            <div className="app">
                <BrowserRouter>
                    <Switch>
                        <Route path="/" component={ LandingPage }></Route>
                    </Switch>
                </BrowserRouter>
            </div>
        )
    }
}

export default App;