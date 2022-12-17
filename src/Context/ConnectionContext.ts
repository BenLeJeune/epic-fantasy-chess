import React from "react";

const RTC_CONFIG = { iceServers: [{"urls":"stun:stun.l.google.com:19302"}] };

type ConnectContext = {
    Conn: RTCPeerConnection,
    Channel : RTCDataChannel|null,
    initChannel: (channel?: RTCDataChannel) => void,
    setListener : ( listener: (e:MessageEvent) => void ) => void
}


const Conn = new RTCPeerConnection(RTC_CONFIG);
let Channel : RTCDataChannel | null  = Conn.createDataChannel('dataChannel');
Channel.onopen = () => {
    console.log('data channel opened!')
}
Channel.onclose = () => {
    console.log('data channel closed!');
}
const initChannel = () => {}
const setListener = ( listener: (e:MessageEvent) => void ) => {
    if (Channel) Channel.onmessage = listener;
    else console.log("Tried to attach listener but no data channel exists.")
}

const ConnectionContext = React.createContext<ConnectContext>({
        Conn,
        Channel,
        initChannel,
        setListener
    }
)

export default ConnectionContext;

export {
    RTC_CONFIG
}