import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PlayRouter from "./Routers/PlayRouter";
import ArmiesRouter from "./Routers/ArmiesRouter";
import Homepage from "./views/Homepage/Homepage";
import DecksRouter from "./Routers/DecksRouter";

export default function MainRouter() {

    return <Router>
        <Switch>
            <Route path="/" exact>
                {/*  The Homepage  */}
                <Homepage/>
            </Route>
            <Route path="/play">
                {/*  The play router  */}
                <PlayRouter/>
            </Route>
            <Route path="/armies">
                {/*  The armies router */}
                <ArmiesRouter/>
            </Route>
            <Route path="/decks">
                {/*  The decks router  */}
                <DecksRouter/>
            </Route>
        </Switch>
    </Router>

}