import React from 'react';
import Routes from './routes/routes';
import { BrowserRouter as Router } from 'react-router-dom';

class App extends React.PureComponent {
    render() {
        return (
            <div className="app">
                <Router>
                    <Routes/>
                </Router>
            </div>
        )
    }
}

export default App;