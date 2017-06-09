import React from 'react';
import {
    BrowserRouter as Router
} from 'react-router-dom';
import AppLayout from './views/layout/index';
import './App.css'

class App extends React.Component {
    render() {
        return (
            <Router>
                <AppLayout/>
            </Router>
        );
    }
}

export default App;
