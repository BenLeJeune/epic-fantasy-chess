import React from "react";
import NiceButton from "../NiceButton/NiceButton";
import "./NavBar.css";

interface props {
    fixed?: boolean
}

export default function NavBar({fixed = true}: props) {

    return <div id="NavBar" style={ fixed ? {} : { position: "absolute" } }>
        <h3 className="navBarHeader">Epic Fantasy Chess</h3>
        <NiceButton onClick="/" text="HOME" buttonStyle="small"/>
        <NiceButton onClick="/play" text="PLAY" buttonStyle="small"/>
        <NiceButton onClick="/armies" text="ARMIES" buttonStyle="small"/>
        <NiceButton onClick="/decks" text="DECKS" buttonStyle="small"/>
    </div>

}