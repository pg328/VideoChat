import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import App from './App';

export const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <App />
                </Route>
                <Route path="/:id">
                    <App />
                </Route>
                <Route path="/about">
                    <></>
                </Route>
                <Route path="/dashboard">
                    <></>
                </Route>
            </Switch>
        </Router>
    );
};

export default Routes;
