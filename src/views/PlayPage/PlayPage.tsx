import React, { useLayoutEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import { FIDEARMY, CRUSADERSARMY } from "../../Presets/Armies";
import "./PlayPage.css"
import {Army} from "../../Presets/Armies"
import NiceButton from "../../components/NiceButton/NiceButton";
import { v4 as generateUUID } from "uuid";
import {GameInfo} from "../../types";
import {randomFromList} from "../../helpers/Utils";
import { ARMY_KEY, GAME_KEY } from "../../KEYS";
import Piece from "../../Classes/Piece";

export default function PlayPage() {

    ///
    /// THE AVAILABLE ARMIES
    ///

    const [ armies, setArmies ] = useState<Army[]>([]);

    const getArmies = () => {
        //Loading the army from local storage
        let armiesJSON = localStorage.getItem( ARMY_KEY );
        let armies = [] as Army[];
        armies.push( FIDEARMY, CRUSADERSARMY );
        if (armiesJSON) {
            let parsedArmies = JSON.parse(armiesJSON) as unknown as { [key:string]: Army };
            //Pushing the armies to an array, if any are found!
            armies.push( ...Object.values(parsedArmies) );
        }
        setArmies(armies);
    }

    useLayoutEffect(() => {
        getArmies()
    }, [] )

    ///
    /// CHOOSING FOR YOURSELF AND YOUR OPPONENT
    ///
    const [ opponent, setOpponent ] = useState<"COMP" | "LOCAL">("LOCAL");
    const [ colour, setColour ] = useState<"WHITE" | "BLACK" | "RANDOM">("WHITE");
    const [ army, setArmy ] = useState<number>(0);
    const [ opponentArmy, setOpponentArmy ] = useState<number>(0);

    ///
    /// LOADING INTO GAME
    ///
    const loadIntoGame = () => {
        const uuid = generateUUID(); // GENERATE UUID
        // RANDOM SELECTIONS
        let _colour = colour === "RANDOM" ? randomFromList([-1, 1]) : ["BLACK", "", "WHITE"].indexOf(colour);
        let _army = army === -1 ? randomFromList(armies) : armies[army];
        let _opponentArmy = opponentArmy === -1 ? randomFromList(armies) : armies[opponentArmy];

        const gameInfo = { // Game Info
            uuid,
            opponent,
            colour: _colour,
            army: JSON.stringify(_army),
            opponentArmy: JSON.stringify(_opponentArmy)
        } as GameInfo

        const gamesData = localStorage.getItem(GAME_KEY) || "{}"; //Get existing game information
        const parsedGamesData = JSON.parse(gamesData) as { [uuid:string]: GameInfo };
        parsedGamesData[uuid] = gameInfo; //Adding the new info
        localStorage.setItem(GAME_KEY, JSON.stringify(parsedGamesData)); //Set the data
        window.location.href = `/play/game/${uuid}`; //Redirect to the game playing page
    }

    const getPointBuyTotal = ( armyPieces : number[] ) => armyPieces.filter( p => p !== 6 ).reduce((prev, next) => (Piece.getPiece(next)?.materialValue || 0) + prev, 0 );

    return <div id="PlayPage" className="paddedTop">

        <NavBar/>
    
        <h1>Setup your game!</h1>

        <div className="playPageInner">
            <h3>Who do you want to face?</h3>
            <SelectionItem item="LOCAL OPPONENT" selected={opponent==="LOCAL"} onPress={()=>setOpponent("LOCAL")}/>
            <SelectionItem item="COMPUTER OPPONENT" selected={opponent==="COMP"} onPress={()=>setOpponent("COMP")}/>

            <h3>Which colour do you want to play as?</h3>
            <SelectionItem item="WHITE" selected={colour==="WHITE"} onPress={setColour}/>
            <SelectionItem item="BLACK" selected={colour==="BLACK"} onPress={setColour}/>
            <SelectionItem item="RANDOM" selected={colour==="RANDOM"} onPress={setColour}/>

            <h3>Which army do you want to use?</h3>
            {
                armies.map(
                    ( a, i ) => <SelectionItem item={a.name.toUpperCase()} selected={army===i} onPress={()=>setArmy(i)}
                                               disabled={getPointBuyTotal(a.pieces) > 31} />
                )
            }
            <SelectionItem item="RANDOM" selected={army===-1} onPress={()=>setArmy(-1)}/>

            <h3>Which army do you want your opponent to use?</h3>
            {
                armies.map(
                    ( a, i ) => <SelectionItem item={a.name.toUpperCase()} selected={opponentArmy===i} onPress={()=>setOpponentArmy(i)}
                                               disabled={getPointBuyTotal(a.pieces) > 31} />
                )
            }
            <SelectionItem item="RANDOM" selected={opponentArmy===-1} onPress={()=>setOpponentArmy(-1)}/>

            
            <h3>Which deck do you want to use?</h3>
            <SelectionItem item="COMING SOON" selected={true} onPress={()=>{}}/>

            
            <h3>Which deck do you want your opponent to use?</h3>
            <SelectionItem item="COMING SOON" selected={true} onPress={()=>{}}/>

            <div className="centred">

                <NiceButton onClick={() => loadIntoGame()} text="START GAME" buttonStyle="medium" />

            </div>

        </div>
        
    </div>

}

interface SelectionItemProps<T> {
    selected: boolean,
    item: T
    onPress: ( item : T ) => void,
    itemToString?: ( item : T ) => String,
    disabled?: boolean
}

export function SelectionItem<T>({ selected, item, onPress, itemToString = item => item as unknown as string, disabled = false }: SelectionItemProps<T>) {

    return <div className={`selectionItem ${ selected ? "selected" : "" } ${ disabled ? "disabled" : "" }`}
        onClick={ disabled ? () => {} : () => onPress(item) }
    >
        { itemToString(item) }
    </div>

}