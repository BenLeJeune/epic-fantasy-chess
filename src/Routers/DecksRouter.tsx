import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';
import DecksPage from "../views/DecksPage/DecksPage";
import DecksBuilderPage from "../views/DecksBuilderPage/DecksBuilderPage";

export default function DecksRouter() {

    const { url } = useRouteMatch()

    return <Switch>

        <Route path={`${url}`} exact>
            <DecksPage/>
        </Route>

        <Route path={`${url}/:deckId`}>
            <DecksBuilderPage/>
        </Route>

    </Switch>

}