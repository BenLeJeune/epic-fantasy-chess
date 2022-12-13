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

    const Conn = useRef(new RTCPeerConnection(RTC_CONFIG));
    const Channel = useRef<RTCDataChannel>(Conn.current.createDataChannel('dataChannel'));


    const initChannel = (remoteChannel?: RTCDataChannel) => {
        if (remoteChannel) { //If we're receiving, set it to the received channel
            Channel.current = remoteChannel
        }
        else { //If we're not receiving, we've got to create the channel ourselves
            Channel.current = Conn.current.createDataChannel('dataChannel');
        }
        Channel.current.onopen = () => {
            console.log('data channel opened!')
        }
        Channel.current.onclose = () => {
            console.log('data channel closed!');
        }
        Channel.current.onmessage = e => console.log("MESSAGE RECEIVED: ", e)
    }

    const setListener = ( listener: (e:MessageEvent) => void ) => {
        if (Channel.current) Channel.current.onmessage = listener;
        else console.log("Tried to attach listener but no data channel exists.")
    }


    return <ConnectionContext.Provider value={{
        Conn: Conn.current,
        Channel: Channel.current,
        initChannel,
        setListener
    }}>
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