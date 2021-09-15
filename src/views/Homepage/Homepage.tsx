import React from 'react';
import { Link } from 'react-router-dom';
import "./Homepage.css";
import NiceButton from "../../components/NiceButton/NiceButton";

export default function Homepage() {

    return <div id="HomepageMain">
        <h1 className="MainTitle">Epic Fantasy Chess</h1>

        <div className="buttonsRow">



            <NiceButton onClick="/play" text="PLAY" buttonStyle="medium"/>

            <NiceButton onClick="/armies" text="ARMIES" buttonStyle="medium"/>

            <NiceButton onClick="/decks" text="DECKS" buttonStyle="medium"/>



        </div>

    </div>

}