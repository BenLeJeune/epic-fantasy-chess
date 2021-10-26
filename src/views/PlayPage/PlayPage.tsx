import React, { useLayoutEffect, useState } from "react";
import NavBar from "../../components/NavBar/NavBar";
import { FIDEARMY, CRUSADERSARMY } from "../../Presets/Armies";
import "./PlayPage.css"
import {Army} from "../../Presets/Armies"
import NiceButton from "../../components/NiceButton/NiceButton";

const ARMY_KEY = "myArmies";

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
    const [ army, setArmy ] = useState<number>(0);
    const [ opponentArmy, setOpponentArmy ] = useState<number>(0);

    ///
    /// LOADING INTO GAME
    ///
    const loadIntoGame = () => {

    }

    return <div id="PlayPage" className="paddedTop">

        <NavBar/>
    
        <h1>Setup your game!</h1>

        <div className="playPageInner">
            <h3>Who do you want to face?</h3>
            <SelectionItem item="LOCAL OPPONENT" selected={opponent==="LOCAL"} onPress={()=>setOpponent("LOCAL")}/>
            <SelectionItem item="COMPUTER OPPONENT" selected={opponent==="COMP"} onPress={()=>setOpponent("COMP")}/>

            <h3>Which army do you want to use?</h3>
            {
                armies.map(
                    ( a, i ) => <SelectionItem item={a.name.toUpperCase()} selected={army===i} onPress={()=>setArmy(i)} />
                )
            }
            <SelectionItem item="RANDOM" selected={army===-1} onPress={()=>setArmy(-1)}/>

            <h3>Which army do you want your opponent to use?</h3>
            {
                armies.map(
                    ( a, i ) => <SelectionItem item={a.name.toUpperCase()} selected={opponentArmy===i} onPress={()=>setOpponentArmy(i)} />
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
    itemToString?: ( item : T ) => String
}

export function SelectionItem<T>({ selected, item, onPress, itemToString = item => item as unknown as string }: SelectionItemProps<T>) {

    return <div className={`selectionItem ${ selected ? "selected" : "" }`}
        onClick={ () => onPress(item) }
    >
        { itemToString(item) }
    </div>

}