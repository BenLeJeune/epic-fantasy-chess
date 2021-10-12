import React from "react";
import "./ArmiesPage.css"
import {Army, FIDEARMY} from "../../Presets/Armies";
import NiceButton from "../../components/NiceButton/NiceButton";
import Piece from "../../Classes/Piece";
import NavBar from "../../components/NavBar/NavBar"

const ARMY_KEY = "myArmies";
export default function ArmiesPage() {

    const getArmies = () => {

        //Reading armies from local storage.
        let armies = [] as Army[];

        let armiesJSON = localStorage.getItem(ARMY_KEY);
        if (armiesJSON) {
            let parsedArmies = JSON.parse(armiesJSON);
            Object.keys(parsedArmies).map(key => armies.push(parsedArmies[key]));
        }

        return armies;
    }

    const createNewArmy = () => {

        let armiesJSON = localStorage.getItem(ARMY_KEY);
        let name : string = "";

        if (armiesJSON) {
            // Get the armies object from localStorage
            let armies = JSON.parse(armiesJSON);
            //Ask for a name for the army - defaults to "My Army"
            name = prompt("Enter a name for your army", "My Army") || "My Army"
            //If an army of that name already exists, ask again!
            while ( armies[name] ) {
                name = prompt("That name has already been chosen") || "My Army"
            }
            //Save to local storage with new army
            let newArmies = Object.assign({
                [ name ]: new Army( FIDEARMY.pieces, name )
            }, armies)
            localStorage.setItem(ARMY_KEY, JSON.stringify(newArmies) );
        }

        else {
            name = prompt("Enter a name for your army", "My Army") || "My Army"
            let armies = {
                [ name ]: new Army( FIDEARMY.pieces, name )
            }
            //Save this new item to local storage
            localStorage.setItem(ARMY_KEY, JSON.stringify(armies));
        }

        //Then, we want to redirect to the army builer page for this army.

        window.location.href = `/armies/${ name }`;



    }

    return <div id="ArmiesPage" className="paddedTop">

        <NavBar/>

        <h1 className="pageHeading">
            Your Armies
        </h1>
        <p className="pageSubtitle">Where you can view, edit, create and delete armies.</p>

        <div className="armiesButtonRow">
            <NiceButton onClick={ () => createNewArmy() } text="NEW ARMY" buttonStyle="small"/>
        </div>

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

    return <div className="armyPreview"
                onClick={ () => window.location.href = `/armies/${ army.name }` }
    >
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