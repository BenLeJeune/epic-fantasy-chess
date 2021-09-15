import React from "react";
import "./ArmiesPage.css"
import {Army, FIDEARMY} from "../../Presets/Armies";
import NiceButton from "../../components/NiceButton/NiceButton";
import Piece from "../../Classes/Piece";

export default function ArmiesPage() {

    const getArmies = () => {

        let armies = [];

        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)
        armies.push(FIDEARMY)

        return armies;
    }

    return <div id="ArmiesPage">

        <div id="NavBar">
            <h3 className="navBarHeader">Epic Fantasy Chess</h3>
            <NiceButton onClick="/" text="HOME" buttonStyle="small"/>
            <NiceButton onClick="/play" text="PLAY" buttonStyle="small"/>
            <NiceButton onClick="/decks" text="DECKS" buttonStyle="small"/>
        </div>

        <h1 className="pageHeading">
            Your Armies
        </h1>
        <p className="pageSubtitle">Where you can view, edit, create and delete armies.</p>

        <div className="armiesListing">
            {
             getArmies().map(
                 army => <ArmyPreview army={army} />
             )
            }
        </div>

    </div>

}

interface ArmyPreviewProps {
    army: Army
}

export function ArmyPreview( { army }: ArmyPreviewProps) {

    return <div className="armyPreview">
        <h3 className="ArmyName">
            { army.name }
        </h3>
        <div className="pieces">
            { army.pieces.map(
                piece => <p>{ Piece.getPiece(piece)?.longName || "name error" }</p>
            ) }
        </div>
    </div>

}