import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import App from "../App";
import PlayPage from "../views/PlayPage/PlayPage";
import OnlinePage from "../views/OnlinePage/OnlinePlayPage";
import OnlinePlayPage from "../views/OnlinePage/OnlinePlayPage";

export default function OnlineRouter() {

    const { url } = useRouteMatch()

    return <Switch>

        <Route path={`${url}`} exact>
            <OnlinePlayPage/>
        </Route>

        <Route path={`${url}/game/:uuid`}>
            <App/>
        </Route>

    </Switch>

}