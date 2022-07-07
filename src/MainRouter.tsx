import React, {useLayoutEffect, useRef} from 'react';
import {BrowserRouter as Router, Switch, Route, useRouteMatch, useLocation} from 'react-router-dom';
import PlayRouter from "./Routers/PlayRouter";
import ArmiesRouter from "./Routers/ArmiesRouter";
import Homepage from "./views/Homepage/Homepage";
import DecksRouter from "./Routers/DecksRouter";
import OnlineRouter from "./Routers/OnlineRouter";
import ConnectionContext, {RTC_CONFIG} from './Context/ConnectionContext';

export default function MainRouter() {

    let location = useLocation()

    useLayoutEffect(() => {
        if ( location.pathname.startsWith("/play/game/") && location.pathname.length > 11 ) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
    }, [location]);

    const conn = useRef(new RTCPeerConnection(RTC_CONFIG))


    return <ConnectionContext.Provider value={ conn.current }>
        <Switch>
            <Route path="/" exact>
                {/*  The Homepage  */}
                <Homepage/>
            </Route>
            <Route path="/play">
                {/*  The play router  */}
                <PlayRouter/>
            </Route>
            <Route path="/online">
                {/*  The online play router  */}
                <OnlineRouter/>
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
    </ConnectionContext.Provider>



}