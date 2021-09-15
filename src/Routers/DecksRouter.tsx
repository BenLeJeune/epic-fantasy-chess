import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';

export default function DecksRouter() {

    const { url } = useRouteMatch()

    return <Switch>

        <Route path={`${url}`} exact>
            <h1>AN OVERVIEW OF YOUR DECKS</h1>
        </Route>

        <Route path={`${url}/:armyID`}>
            <h1>BUILDING A DECK</h1>
        </Route>

    </Switch>

}