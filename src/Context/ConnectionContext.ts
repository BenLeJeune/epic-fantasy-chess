import React from "react";

const RTC_CONFIG = { iceServers: [{"urls":"stun:stun.l.google.com:19302"}] };

type OnlineContext = {
    conn: RTCPeerConnection
}


const conn = new RTCPeerConnection(RTC_CONFIG);
let dataChannel : RTCDataChannel;

const initDataChannel = () => {
    dataChannel = conn.createDataChannel('dataChannel');
    dataChannel.onopen = () => {
        console.log('data channel opened!')
    }
    dataChannel.onclose = () => {
        console.log('data channel closed!');
    }
}

const setListener = ( listener: (e:MessageEvent) => void ) => {
    if (dataChannel) dataChannel.onmessage = listener;
    else console.log("Tried to attach listener but no data channel exists.")
}

const ConnectionContext = React.createContext<RTCPeerConnection>(
    conn
)

export default ConnectionContext;

export {
    RTC_CONFIG
}