import React, {useRef} from 'react';
import { Link } from 'react-router-dom';
import "./Homepage.css";
import NiceButton from "../../components/NiceButton/NiceButton";
import {Buffer} from "buffer";

export default function Homepage() {

    const popup = useRef<HTMLDivElement>(null);

    const showInformation = () => {
        if (popup.current) {
            popup.current.className = "shown"
        }
    }
    const hideInformation = () => {
        if (popup.current) {
            popup.current.className = "hidden"
        }
    }

    return <div id="HomepageMain">
        <h1 className="MainTitle">Epic Fantasy Chess</h1>

        <div className="buttonsRow">

            <NiceButton onClick="/play" text="PLAY" buttonStyle="medium"/>

            <NiceButton onClick="/online" text="PLAY ONLINE" buttonStyle="medium"/>

            <NiceButton onClick="/armies" text="ARMIES" buttonStyle="medium"/>

            <NiceButton onClick="/decks" text="DECKS" buttonStyle="medium"/>

        </div>

        <div className="infoRow">
            <p onMouseDown={ showInformation }>How to play</p>
        </div>

        <div ref={popup} className="hidden" id="HowToPlayPopup">
            <div id="PopupBackground"/>
            <div id="HowToPlayPopupBubble">
                <h1>Welcome to Epic Fantasy Chess!</h1>
                <p>Chess, but with a twist - or several!</p>
                <div className="left section">
                    <h2>Choose your pieces!</h2>
                    <p>You can build armies from regular chess pieces, plus some fairy ones!</p>
                    <p>Try out different armies to see what works for your style.</p>
                    <p>If you see a piece in game and don't know what it does, <b>right-click</b> to find out more!</p>
                    <div id="ScatteredPieces">
                        <img src="./Assets/Misc/scattered-pieces.svg"/>
                    </div>
                </div>
                <div className="right section">
                    <h2>Play Cards!</h2>
                    <p>Instead of making a move, you can instead <b>Play Cards!</b> Cards can affect the board, move pieces, or even summon new ones!</p>
                    <p>Cards can be played once their <b>Chaos Score</b> has been reached - after that many points worth of pieces have been captured!</p>
                    <p>Be careful, however - they <b>can't be played while in check!</b></p>
                    <p>Some cards are <b>fast</b>. This means you can play them without ending your turn - so you can play another, or make a regular move!</p>
                    <div id="ScatteredCards">
                        <img src="./Assets/Misc/scattered-cards.svg"/>
                    </div>
                </div>
                <div className="left section">
                    <h2>Pre-made or Customised!</h2>
                    <p>There are a few <b>pre-made</b> decks and armies for you to try out, or you can make your own with any combination you wish!</p>
                    <p>The <b>FIDE</b> army uses regular pieces, and their deck is <b>balanced</b> with cards to <b>move, promote</b> or even <b>demote</b> pieces!</p>
                    <p>The <b>Colourbound Crusaders</b> use strong pieces stuck on a single colour - with cards to <b>maneuver</b> the board and <b>limit</b> your opponent's choices!</p>
                </div>
                <div className="thin section">
                    <NiceButton buttonStyle="medium" onClick={ hideInformation } text="Cool!"/>
                </div>

            </div>


        </div>

    </div>

}