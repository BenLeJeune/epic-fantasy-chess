import React, {useLayoutEffect, useRef, useState} from 'react';
import {Route, Switch, useLocation} from 'react-router-dom';
import PlayRouter from "./Routers/PlayRouter";
import ArmiesRouter from "./Routers/ArmiesRouter";
import Homepage from "./views/Homepage/Homepage";
import DecksRouter from "./Routers/DecksRouter";
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
    Conn.current.onconnectionstatechange = () => setConnectionState(Conn.current.connectionState)
    //const Channel = useRef<RTCDataChannel|null>(/*Conn.current.createDataChannel('original data channel')*/null);

    const [ Channel, setChannel ] = useState<RTCDataChannel|null>(null);

    // Slightly cheating to make sure the connection state stays up to date
    const [connectionState, setConnectionState] = useState<string>('Not Connected');


    const initChannel = (remoteChannel?: RTCDataChannel) => {
        if (remoteChannel) { //If we're receiving, set it to the received channel
            console.log(`Adding remote channel ${remoteChannel.id}`)
            console.log("Current channel: \n", Channel)
            console.log("Received channel: \n", remoteChannel)
            //Channel.current = remoteChannel?
            setChannel(remoteChannel)
            console.log("Added remote channel: \n ", Channel)
        }
        else { //If we're not receiving, we've got to create the channel ourselves
            let newDataChannel = Conn.current.createDataChannel('data channel')
            setChannel(newDataChannel);
            console.log("Created channel " + newDataChannel.id)
        }
        let id = Channel?.id;
        if (Channel) {
            Channel.onopen = () => {
                console.log(`Data channel ${Channel?.id} opened!`)
            }
            Channel.onclose = () => {
                console.log(`Data channel ${id} closed!`);
            }
            Channel.onmessage = e => {
                console.log(`MESSAGE RECEIVED on channel ${id} (Currently listening on ${Channel?.id}:`, e)
            }
        }
    }

    const setListener = ( listener: (e:MessageEvent) => void ) => {
        if (Channel) {
            Channel.onmessage = listener;
            console.log("Updated event listener")
        }
        else console.log("Tried to attach listener but no data channel exists.")
    }


    return <ConnectionContext.Provider value={{
        Conn: Conn.current,
        Channel: Channel,
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