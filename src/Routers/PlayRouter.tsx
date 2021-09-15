import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';
import App from "../App";

export default function PlayRouter() {

    const { url } = useRouteMatch()

    return <Switch>

        <Route path={`${url}`} exact>
            <h1>SETTING UP YOUR GAME</h1>
        </Route>

        <Route path={`${url}/playing`}>
            <App/>
        </Route>

    </Switch>

}