import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import NavBar from "../../components/NavBar/NavBar";
import { FIDEARMY, CRUSADERSARMY } from "../../Presets/Armies";
import {Army} from "../../Presets/Armies"
import NiceButton from "../../components/NiceButton/NiceButton";
import { v4 as generateUUID } from "uuid";
import {GameInfo} from "../../types";
import {randomFromList} from "../../helpers/Utils";
import {ARMY_KEY, DECK_KEY, GAME_KEY} from "../../KEYS";
import Piece from "../../Classes/Piece";
import { Link } from "react-router-dom";
import {CRUSADERSDECK, Deck, FIDEDECK} from "../../Presets/Decks";

import './OnlinePage.css';

const RTC_CONFIG = { iceServers: [{"urls":"stun:stun.l.google.com:19302"}] };


export default function OnlinePlayPage() {

    ///
    /// CREATING A WebRTC CONNECTION
    ///
    const conn = useRef<RTCPeerConnection>(new RTCPeerConnection(RTC_CONFIG));
    const [ offer, setOffer ] = useState<String>("");

    function generateLocalOffer() {
        conn.current.createOffer().then(
            desc => {
                conn.current.setLocalDescription(desc).then(() => {
                    setTimeout(() => {
                        if (conn.current.iceGatheringState === "complete") return;
                        console.log("After GetherTimeout");
                        setOffer( JSON.stringify(conn.current.localDescription) );
                        console.log(btoa( JSON.stringify(conn.current.localDescription) ) )
                    }, 2000)
                });
                console.log("Set local description");
            }
        )
    }

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
    ///
    /// THE AVAILABLE DECKS
    ///
    const [ decks, setDecks ] = useState<Deck[]>([]);
    const getDecks = () => {
        //Loading the army from local storage
        let decksJSON = localStorage.getItem( DECK_KEY );
        let decks = [] as Deck[];
        decks.push( FIDEDECK, CRUSADERSDECK );
        if (decksJSON) {
            let parsedDecks = JSON.parse(decksJSON) as unknown as { [key:string]: Deck };
            //Pushing the armies to an array, if any are found!
            decks.push( ...Object.values(parsedDecks) );
        }
        setDecks(decks);
    }

    ///
    /// CURRENTLY EXISTING GAMES
    ///
    const [ games, setGames ] = useState<GameInfo[]>([]);
    const getGames = () => {
        //Loading games from local storage
        let gamesJSON = localStorage.getItem( GAME_KEY );
        let games = [] as GameInfo[];
        if ( gamesJSON ) {
            let parsedGames = JSON.parse( gamesJSON ) as unknown as { [key: string]: GameInfo }
            //Push games into the array, if any are found!
            games.push( ...Object.values(parsedGames) );
        }
        setGames(games);
    }

    useLayoutEffect(() => {
        getArmies();
        getDecks();
        getGames();
    }, [] )

    ///
    /// CHOOSING FOR YOURSELF AND YOUR OPPONENT
    ///
    const [ colour, setColour ] = useState<"WHITE" | "BLACK" | "RANDOM">("WHITE");
    const [ army, setArmy ] = useState<number>(0);

    const [ deck, setDeck ] = useState<number>(0);

    ///
    /// LOADING INTO GAME
    ///
    const loadIntoGame = () => {
        const uuid = generateUUID(); // GENERATE UUID
        // RANDOM SELECTIONS
        let _colour = colour === "RANDOM" ? randomFromList([-1, 1]) : ["BLACK", "", "WHITE"].indexOf(colour) - 1;
        let _army = army === -1 ? randomFromList(armies) : armies[army];
        let _deck = deck === -1 ? randomFromList(decks) : decks[deck];

        //!TODO No game info yet, temp. while P2P connection not established.
        let opponent = "LOCAL", _opponentArmy = _army, _opponentDeck = _deck;

        const gameInfo = { // Game Info
            uuid,
            opponent,
            colour: _colour,
            army: JSON.stringify(_army),
            opponentArmy: JSON.stringify(_opponentArmy),
            deck: JSON.stringify(_deck),
            opponentDeck: JSON.stringify(_opponentDeck)
        } as GameInfo

        const gamesData = localStorage.getItem(GAME_KEY) || "{}"; //Get existing game information
        const parsedGamesData = JSON.parse(gamesData) as { [uuid:string]: GameInfo };
        parsedGamesData[uuid] = gameInfo; //Adding the new info
        localStorage.setItem(GAME_KEY, JSON.stringify(parsedGamesData)); //Set the data
        window.location.href = `/play/game/${uuid}`; //Redirect to the game playing page
    }

    const getPointBuyTotal = ( armyPieces : number[] ) => armyPieces.filter( p => p !== 6 ).reduce((prev, next) => (Piece.getPiece(next)?.materialValue || 0) + prev, 0 );

    ///
    /// WHETHER OR NOT THE EXISTING GAMES ARE GOING TO BE SHOWN
    ///
    //TODO: Replace with showing existing connections.
    const [ showExistingGames, setShowExistingGames ] = useState<boolean>(false);
    const renderExistingGame = ( g: GameInfo ) => {

        let playerArmy = JSON.parse(g.army) as Army;
        let opponentArmy = JSON.parse(g.opponentArmy) as Army;

        return <Link to={`/play/game/${g.uuid}`}>
            <div title={ `Game ${g.uuid}` } className="existingGame">
                <p>{g.colour > 0 ? playerArmy.name : opponentArmy.name},</p>
                <p>{g.colour < 0 ? playerArmy.name : opponentArmy.name}</p>
                <p>vs { g.opponent === "LOCAL" ? "Local Opponent" : "Computer Opponent" }</p>
            </div>
        </Link>
    }

    const getExistingGames = () => games.map( renderExistingGame )


    return <div id="PlayPage" className="paddedTop">

        <NavBar/>

        <h1>Setup your game!</h1>

        <div className="existingGames">
            {
                showExistingGames ? getExistingGames() : null
            }
        </div>
        <div className="playPageInner">

            <h3>Which colour do you want to play as?</h3>
            <SelectionItem item="WHITE" selected={colour==="WHITE"} onPress={setColour}/>
            <SelectionItem item="BLACK" selected={colour==="BLACK"} onPress={setColour}/>
            <SelectionItem item="RANDOM" selected={colour==="RANDOM"} onPress={setColour}/>

            <h3>Which army do you want to use?</h3>
            {
                armies.map(
                    ( a, i ) => <SelectionItem item={a.name.toUpperCase()} selected={army===i} onPress={()=>setArmy(i)}
                                               disabled={getPointBuyTotal(a.pieces) > 31} toolTip={ARMY_TIP} />
                )
            }
            <SelectionItem item="RANDOM" selected={army===-1} onPress={()=>setArmy(-1)}/>

            <h3>Which deck do you want to use?</h3>
            {
                decks.map(
                    ( d, i ) => <SelectionItem item={d.name.toUpperCase()} selected={deck===i} onPress={()=>setDeck(i)}
                                               disabled={ d.cards.length !== 15 } toolTip={DECK_TIP} />
                )
            }
            <SelectionItem item="RANDOM" selected={deck===-1} onPress={()=>setDeck(-1)}/>

            <div className="centred">

                <NiceButton onClick={() => loadIntoGame()} text="START GAME" buttonStyle="medium" />

            </div>

        </div>

    </div>

}

const ARMY_TIP = "Army too strong - edit it to play with it.";
const DECK_TIP = "Your deck has the incorrect number of cards - edit it to play with it."

interface SelectionItemProps<T> {
    selected: boolean,
    item: T
    onPress: ( item : T ) => void,
    itemToString?: ( item : T ) => String,
    disabled?: boolean,
    toolTip?: string
}

export function SelectionItem<T>({ selected, item, onPress, itemToString = item => item as unknown as string, toolTip, disabled = false }: SelectionItemProps<T>) {

    return <div title={disabled ? toolTip : ""} className={`selectionItem ${ selected ? "selected" : "" } ${ disabled ? "disabled" : "" }`}
                onClick={ disabled ? () => {} : () => onPress(item) }
    >
        { itemToString(item) }
    </div>

}