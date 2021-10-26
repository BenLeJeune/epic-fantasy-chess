import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import App from "../App";
import PlayPage from "../views/PlayPage/PlayPage";

export default function PlayRouter() {

    const { url } = useRouteMatch()

    return <Switch>

        <Route path={`${url}`} exact>
            <PlayPage/>
        </Route>

        <Route path={`${url}/playing`}>
            <App/>
        </Route>

    </Switch>

}