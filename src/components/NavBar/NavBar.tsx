import React, {useContext, useRef, useState} from "react";
import NiceButton from "../NiceButton/NiceButton";
import "./NavBar.css";
import ConnectionContext from "../../Context/ConnectionContext";
import ConnectionWizard from "../ConnectionWizard/ConnectionWizard";

interface props {
    fixed?: boolean
}

export default function NavBar({fixed = true}: props) {

    const Conn = useContext(ConnectionContext);
    const connectionState = () => {
        switch (Conn.connectionState) {
            case "new":
            case "closed":
                return "not connected";
                break;
            default:
                return Conn.connectionState;
        }
    };

    const popupRef = useRef<HTMLDivElement>(null);
    // Returns true while the "Connecting" popup is open.
    const [Connecting, attemptConnect] = useState(false);

    const openConnectionPopup = ( e:React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
        // Prevents the listener from being fired immediately
        e.preventDefault();
        e.stopPropagation();
        attemptConnect(true); // Show Popup
        //Define click listener function to close the popup
        function clickListener( e: MouseEvent ) {
            if (popupRef.current) {
                let { x, y, height, width } = popupRef.current?.getBoundingClientRect()
                if ( x < e.x && e.x < x + width && y < e.y  && e.y < y + height ) return; //Within the popup
                attemptConnect(false); //Close the popup
                window.removeEventListener("click", clickListener); //Remove this event listener
            }
        }
        //Add the listener so the popup closes whenever anything other than the bubble is being clicked on.
        window.addEventListener("click", clickListener);
    }

    return <> <div id="NavBar" style={ fixed ? {} : { position: "absolute" } }>
        <h3 className="navBarHeader">Epic Fantasy Chess</h3>
        <NiceButton onClick="/" text="HOME" buttonStyle="small"/>
        <NiceButton onClick="/play" text="PLAY" buttonStyle="small"/>
        <NiceButton onClick="/armies" text="ARMIES" buttonStyle="small"/>
        <NiceButton onClick="/decks" text="DECKS" buttonStyle="small"/>
        <div id="ConnectionManager" onClick={ e => openConnectionPopup(e)}>
            {connectionState()}
        </div>
    </div>

        <ConnectionWizard shown={Connecting} popupRef={popupRef} />

    </>

}