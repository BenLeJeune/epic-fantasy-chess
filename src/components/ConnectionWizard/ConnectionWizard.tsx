import React, {ChangeEvent, ChangeEventHandler, Ref, useContext, useState} from 'react';
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

    const Conn = useContext(ConnectionContext);

    // whether or not the current user is the initiator.
    const [ connInitiator, setInitiator ] = useState<initiator>(initiator.none);

    const [ localOffer, setLocalOffer ] = useState<string>();

    const [ remoteOffer, setRemoteOffer ] = useState<string>("");
    const handleRemoteOfferChange = ( event: ChangeEvent<HTMLInputElement>) => {
        setRemoteOffer(event.target.value);
    }

    const errHandler = (e:Error) => console.log(e);

    const offerHandler = ( creating : boolean ) => {
        setInitiator( creating ? initiator.local : initiator.remote )
        // CREATE THE ACTUAL OFFER
        Conn.onicecandidate = e => {
            if ( !e.candidate ) {
                console.log('iceGatheringState complete\n', Conn.localDescription?.sdp)
                let offer =  JSON.stringify(Conn.localDescription) ;
                setLocalOffer( encodeOffer(offer) );
            }
            else console.log(e.candidate.candidate);
        }

        Conn.createOffer().then( description => {
            console.log('createOffer ok');
            Conn.setLocalDescription(description).then(() => {
                setTimeout(() => {
                    // WAIT FOR ICE CONNECTION
                    if ( Conn.iceGatheringState === "complete" ) return;
                    console.log('after GetherTimeout');
                    let offer = JSON.stringify(Conn.localDescription);
                    setLocalOffer( encodeOffer(offer) );
                })
            })
        } )
    }

    const attemptConnection = () => {
        let decodedRemoteOffer = decodeOffer( remoteOffer );
        let remoteDescription = JSON.parse(decodedRemoteOffer);
        let _remoteOffer = new RTCSessionDescription(remoteDescription);
        console.log('Remote offer: \n', _remoteOffer);

        //Set the remote description
        Conn.setRemoteDescription(_remoteOffer).then(() => {
            console.log('Set Remote Description OK');
            if ( _remoteOffer.type === "offer" ) {
                Conn.createAnswer().then( description => {
                    console.log('createAnswer 200 ok \n', description)
                    Conn.setLocalDescription(description).then(() => {}).catch(errHandler);
                }).catch(errHandler);
            }
        }).catch(errHandler);
    }


    return <div className={ shown ? "shown" : "hidden" } id="ConnectingPopup">
        <div id="PopupBackground"/>
            <div id="ConnectionPopupBubble" ref={popupRef}>
                <h1>Connecting!</h1>
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
                        <TextCopy text={localOffer||"ERROR - view browser console"}/>
                        <p>
                            Copy this string, and send it to your opponent. Ask them to send theirs back, and enter it into the field below!
                        </p>
                        <TextInput text={remoteOffer} onChange={e => handleRemoteOfferChange(e)}/>
                        <NiceButton disabled={ remoteOffer === "" } onClick={ () => attemptConnection() } text="Connect!"/>
                    </div>
                }
                {/*  SHOWN IN AN ALTERNATE ORDER IF OFFER MADE THE OTHER WAY AROUND  */}
                {
                    connInitiator !== initiator.remote ? null :
                        <div className="section">
                            <TextInput text={remoteOffer} onChange={e => handleRemoteOfferChange(e)}/>
                            <p>
                                Enter the description you've been given, then send your opponent yours!
                            </p>
                            <TextCopy text={localOffer||"ERROR - view browser console"}/>
                            <NiceButton disabled={ remoteOffer === "" } onClick={ () => attemptConnection() } text="Connect!"/>
                        </div>
                }
            </div>
        </div>

}