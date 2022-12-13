import React, {
    ChangeEvent,
    ChangeEventHandler,
    Ref,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from 'react';
import "./ConnectionWizzard.css";
import ConnectionContext from "../../Context/ConnectionContext";
import NiceButton from "../NiceButton/NiceButton";
import {decodeOffer, encodeOffer} from "../../helpers/Encoding";
import TextCopy from "../TextCopy/TextCopy";
import TextInput from "../TextInput/TextInput";

type WizardProps = {
    shown: boolean,
    popupRef: Ref<HTMLDivElement> | undefined
}

enum initiator  { none = 0, local = 1, remote = 2 };

export default function ConnectionWizard({ shown, popupRef }: WizardProps) {

    const { Conn, Channel, setListener, initChannel} = useContext(ConnectionContext);

    // whether or not the current user is the initiator.
    const [ connInitiator, setInitiator ] = useState<initiator>(initiator.none);

    const [ localOffer, setLocalOffer ] = useState<string>();

    const [ remoteOffer, setRemoteOffer ] = useState<string>("");
    const handleRemoteOfferChange = ( event: ChangeEvent<HTMLInputElement>) => {
        setRemoteOffer(event.target.value);
    }

    // The currently received ice offers
    const iceCandidates = useRef<RTCIceCandidate[]>([]);

    useEffect(() => {
        //Adding necessary ICE listeners!
        Conn.addEventListener('icecandidate', event => {
            if (event.candidate) {
                console.log("Found ICE candidate \n", event.candidate);
                iceCandidates.current.push(event.candidate)
            }
        })

        Conn.addEventListener('icegatheringstatechange', e => {
            console.log("ice gathering state change: \n", Conn.iceGatheringState)
        });

        Conn.addEventListener('connectionstatechange', e => {
            console.log("Connection state change: ", Conn.connectionState)
            if (Conn.connectionState === 'connected') {
                if (connInitiator === initiator.local) initChannel()
            }
        });

        (window as any).DEV_SEND_MSG = (data : String) => {
            // @ts-ignore
            Channel.send(data)
            console.log('sent message ', data)
        }

    }, [])

    const errHandler = (e:Error) => console.log(e);

    const offerHandler = ( creating : boolean ) => {
        setInitiator( creating ? initiator.local : initiator.remote )
        // CREATE THE ACTUAL OFFER
        Conn.onicecandidate = e => {
            if ( !e.candidate ) {
                console.log('iceGatheringState complete\n', Conn.localDescription?.sdp)
                let offer =  JSON.stringify(Conn.localDescription);
                let candidates = JSON.stringify(iceCandidates.current)
                console.log("Candidates: \n", candidates)
                setLocalOffer( encodeOffer(offer, candidates) );
            }
            else console.log(e.candidate.candidate);
        }

        // If we're initiating the connection, generate the offer
        if (creating) Conn.createOffer().then( description => {
            console.log('createOffer ok');
            Conn.setLocalDescription(description).then(() => {
                //We actually generate the offer when the ice candidates are connected
            })
        } )
        else {
            Conn.ondatachannel = e => {
                initChannel(e.channel);
                console.log("Received a data channel")
            }
        }
    }

    const attemptConnection = () => {
        // Want to generate an answer
        let [decodedRemoteOffer, decodedIceCandidates] = decodeOffer(remoteOffer);
        let remoteDescription = JSON.parse(decodedRemoteOffer);
        let _remoteOffer = new RTCSessionDescription(remoteDescription);
        let remoteIceCandidates = JSON.parse(decodedIceCandidates)
        console.log('Received offer from remote: \n', _remoteOffer);
        console.log("Received ice candidates: \n", decodedIceCandidates)

        //Received the offer - now set the remote description, and generate an answer
        Conn.setRemoteDescription(_remoteOffer).then(() => {
            console.log("Set the remote description")
            if (_remoteOffer.type === "offer") {
                Conn.createAnswer().then( answer => {
                    console.log('createAnswer ok \n', answer);
                    Conn.setLocalDescription(answer).then(() => {})
                } ).catch(errHandler)
            }
        }).catch(errHandler)
        //Now, we want to set the connection ice candidates
        console.log(remoteIceCandidates)
        try {
            (remoteIceCandidates as RTCIceCandidate[]).forEach(candidate => {
                    Conn.addIceCandidate(candidate).then(() => {console.log("Adding ice candidate: \n", candidate)} )
                }
            )
        }
        catch (e) { console.log("Failed to assign ice candidates \n", e) }

    }


    return <div className={ shown ? "shown" : "hidden" } id="ConnectingPopup">
        <div id="PopupBackground"/>
            <div id="ConnectionPopupBubble" ref={popupRef}>
                <h1>{Conn.connectionState}</h1>
                <div className="section">
                     <p>In order to play online, you have to connect directly to another server. This can be done by creating an offer.</p>
                      <p>Either player can create the first offer.</p>
                    <div className="row">
                        <NiceButton disabled={connInitiator !== initiator.none} highlight={connInitiator === initiator.local}
                                    onClick={() => offerHandler(true)} text="Create an Offer"/>
                        <NiceButton disabled={connInitiator !== initiator.none} highlight={connInitiator === initiator.remote}
                                    onClick={() => offerHandler(false)} text="Recieve an Offer"/>
                    </div>
                </div>
                {/*  THE FOLLOWING SECTION IS SHOWN WHEN A LOCAL OFFER IS MADE FIRST  */}
                {
                    connInitiator !== initiator.local ? null :
                    <div className="section">
                        <label>Your Offer</label>
                        <TextCopy text={localOffer||"ERROR - view browser console"}/>
                        <p>
                            Copy this string, and send it to your opponent. Ask them to send theirs back, and enter it into the field below!
                        </p>
                        <label>Remote Offer</label>
                        <TextInput text={remoteOffer} onChange={e => handleRemoteOfferChange(e)}/>
                        <NiceButton disabled={ remoteOffer === "" } onClick={ () => attemptConnection() } text="Connect!"/>
                    </div>
                }
                {/*  SHOWN IN AN ALTERNATE ORDER IF OFFER MADE THE OTHER WAY AROUND  */}
                {
                    connInitiator !== initiator.remote ? null :
                        <div className="section">
                            <label>Remote Offer</label>
                            <TextInput text={remoteOffer} onChange={e => handleRemoteOfferChange(e)}/>
                            <p>
                                Enter the description you've been given, then send your opponent yours!
                            </p>
                            <label>Your Offer</label>
                            <TextCopy text={localOffer||"ERROR - view browser console"}/>
                            <NiceButton disabled={ remoteOffer === "" } onClick={ () => attemptConnection() } text="Generate Answer"/>
                        </div>
                }
            </div>
        </div>

}