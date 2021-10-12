import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import App from "../App";

export default function PlayRouter() {

    const { url } = useRouteMatch()

    return <Switch>

        <Route path={`${url}`} exact>
            <h1>SETTING UP YOUR GAME</h1>
            <Link to={`${url}/playing`}>PLAY A GAME</Link>
        </Route>

        <Route path={`${url}/playing`}>
            <App/>
        </Route>

    </Switch>

}