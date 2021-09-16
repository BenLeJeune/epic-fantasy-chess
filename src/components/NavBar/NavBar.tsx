import React from "react";
import NiceButton from "../NiceButton/NiceButton";
import "./NavBar.css";

export default function NavBar() {

    return <div id="NavBar">
        <h3 className="navBarHeader">Epic Fantasy Chess</h3>
        <NiceButton onClick="/" text="HOME" buttonStyle="small"/>
        <NiceButton onClick="/play" text="PLAY" buttonStyle="small"/>
        <NiceButton onClick="/decks" text="DECKS" buttonStyle="small"/>
    </div>

}