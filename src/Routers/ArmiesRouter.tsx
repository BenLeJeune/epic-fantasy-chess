import React from 'react';
import { BrowserRouter as Router, Switch, Route, useRouteMatch } from 'react-router-dom';
import ArmiesPage from "../views/ArmiesPage/ArmiesPage";
import ArmiesBuilderPage from "../views/ArmiesBuilderPage/ArmiesBuilderPage";

export default function ArmiesRouter() {

    const { url } = useRouteMatch()

    return <Switch>

        <Route path={`${url}`} exact>
            <ArmiesPage/>
        </Route>

        <Route path={`${url}/:armyID`}>
            <ArmiesBuilderPage/>
        </Route>

    </Switch>

}