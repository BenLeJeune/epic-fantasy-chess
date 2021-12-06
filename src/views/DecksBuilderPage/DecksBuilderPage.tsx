import React, {useState, useLayoutEffect, useRef} from "react";
import { useParams } from "react-router-dom";
import "./DecksBuilderPage.css"
import { Army } from "../../Presets/Armies";
import Piece from "../../Classes/Piece"
import NiceButton from "../../components/NiceButton/NiceButton";
import NavBar from "../../components/NavBar/NavBar";
import {ARMY_KEY, DECK_KEY} from "../../KEYS";
import {Deck, FIDEDECK} from "../../Presets/Decks";
import ALL_CARDS from "../../Cards/Cards";

export default function DecksBuilderPage() {

    let { deckId } = useParams<{ deckId: string }>();

    let [ deckName, setDeckName ] = useState("");

    let [ deckCards, setDeckCards ] = useState([] as string[])

    let [ changesMade, setChangesMade ] = useState(false);

    useLayoutEffect(() => {
        //Run this when the page first loads - retrieve data about the army
        let decksJSON = localStorage.getItem( DECK_KEY );
        if ( !decksJSON ) {
            // If you don't have any armies, then you shouldn't be here!
            alert("No deck detected. Redirecting to army menu.")
            window.location.href = "./decks";
        }
        else {
            let decks = JSON.parse(decksJSON);
            console.log(decks, deckId);
            setDeckName( decks[deckId].name );
            setDeckCards( decks[deckId].cards );
        }
    }, [])

    let [ cardDragging, setCardDragging ] = useState<"lib"|"list"|null>(null);

    const onDragStart = ( e : React.DragEvent, card: string, origin: "lib" | "list" ) => {
        setCardDragging(origin);
        if (e.dataTransfer) {
            e.dataTransfer.setData("text/plain", card);
            e.dataTransfer.effectAllowed = "copyMove";
        }
    }

    const onDragEnd = () => {
        setCardDragging(null);
    }

    const onDrop = ( e: React.DragEvent ) => {
        if (e.dataTransfer) {
            const cardId = e.dataTransfer.getData("text/plain");
            if (cardId) {
                //We've got the card ID
                //Now, we were either removing the card, or adding the card
                if ( cardDragging === "lib" ) {
                    // Dragging from library into deck, adding
                    setDeckCards(prev => {
                        let newCards = [...prev];
                        newCards.push(cardId);
                        return newCards.sort(( a, b ) => ALL_CARDS[a].cost - ALL_CARDS[b].cost);
                    })
                }
                else {
                    //Dragging from deck to library, removing card
                    setDeckCards(prev => {
                        let index = prev.indexOf(cardId);
                        return [ ...prev.slice(0, index), ...prev.slice(index + 1, prev.length) ]
                    })
                }
                setCardDragging(null);
                if (!changesMade) setChangesMade(true);
            }
        }
    }


    /*const getChessBoard = () => {
        let chessSquares = [];
        for (let i = 0; i <= 7; i++) {
            chessSquares.push(
                <div style={{ left: `${ ( i ) * 12.5 }%` }} className={`lowerBoardSquare ${ i % 2 === 0 ? "dark" : "light" }`}/>
            )
        }

        return chessSquares
    }

    const getChessPieces = () => armyPieces.map(
        ( piece, i ) => <div className="lowerBoardPiece"
                style={{ left: `${ ( i ) * 12.5 }%` }}
                 onDrop={ e => onDrop( e, i ) }
                 onDragOver={ e => {
                     e.preventDefault();
                     e.dataTransfer.dropEffect = "move";
                 } }
        >
            <img src={ Piece.getImage(piece) } />
        </div>
    )

    const pieceDragStart = ( e : React.DragEvent, piece : number ) => {
        if ( e.dataTransfer ) {
            e.dataTransfer.setData("text", `${piece}`);
            e.dataTransfer.effectAllowed = "move";
        }
    }

    const pieceDragEnd = ( piece : number ) => {

    }

    let pointBuyRef = useRef<HTMLElement>(null);
    const getPointBuyTotal = () => armyPieces.filter( p => p !== 6 ).reduce((prev, next) => (Piece.getPiece(next)?.materialValue || 0) + prev, 0 );

    const onDrop = ( e : React.DragEvent, i : number ) => {
        let piece : number = Number(e.dataTransfer.getData("text"));
        //We dragged this piece to the target location
        if ( i !== 4 ) { //We can't replace the king!
            let newPieces = [
            ...armyPieces.slice(0, i), piece, ...armyPieces.slice(i+1)
            ]
            setArmyPieces( newPieces )
            setChangesMade(true);

            if (pointBuyRef.current) {
                pointBuyRef.current.className = "";
                if (newPieces.filter( p => p !== 6 ).reduce((prev, next) => (Piece.getPiece(next)?.materialValue || 0) + prev, 0 ) > 31) {
                    setTimeout(() => {
                            if (pointBuyRef.current) pointBuyRef.current.className = "invalid";

                        }, 0)
                }
            }
        }
    }
*/
    const getCardLibrary = () => Object.values(ALL_CARDS).map(
        ( card, i ) => <div className="libraryCard" draggable onDragStart={e => onDragStart(e, card.id, "lib")} onDragEnd={onDragEnd}>
            <div>
                <p>({ card.cost }) { card.cardName }</p>
                <p>{ card.description }</p>
            </div>
        </div>
    )

    const getCardListing = () => [...deckCards].filter((c, i, a) => a.indexOf(c) === i).map(
        ( card, i ) => <div className="listedCard" draggable onDragStart={e => onDragStart(e, card, "list")} onDragEnd={onDragEnd} >
            <span className="chaosValue">({ ALL_CARDS[card].cost})</span>
            <span className="cardName">{ ALL_CARDS[card].cardName }</span>
            <span className="cardQuantity">x{ getDeckQuantity(card) }</span>
        </div>
    )

    const getDeckQuantity = ( cardId: string ) => deckCards.filter(c => c === cardId).length

    const saveChanges = () => {
        let decksJSON = localStorage.getItem(DECK_KEY);

        if (decksJSON) {
            let decks = JSON.parse(decksJSON);
            let newName = prompt("Choose your deck's name", deckName) || deckName;

            if ( newName !== deckName ) delete decks[deckName]; //Get rid of the old key
            decks[newName] = new Deck( deckCards, newName );

            localStorage.setItem(DECK_KEY, JSON.stringify(decks));

            window.location.href = `/decks`;
        }
    }

    return <div id="DecksBuilderPage" className="paddedTop">

        <NavBar/>
        <h1>{ deckId }</h1>

        <div className="decksManager">

            <div className="cardListPreview">

                <div className={`cardListBox`}>
                    <h2 className="cardListingTitle">Decklist</h2>
                    {   getCardListing()    }
                    {
                        cardDragging !== "lib" ? null :
                            <div className="libDragReceiverOuter"
                                onDrop={onDrop}
                                onDragOver={ e => {
                                     e.preventDefault();
                                     e.dataTransfer.dropEffect = "copy";
                                } }>
                            <div className="dragHereNotice">
                                Drag here to add a card to
                                your deck
                            </div>
                        </div>
                    }

                </div>

            </div>

            <div className="cardsList">
                <div className="cardLibrary">

                    { getCardLibrary() }

                    {
                        cardDragging !== "list" ? null :
                            <div className="listDragReceiver"
                                 onDrop={onDrop}
                                 onDragOver={ e => {
                                     e.preventDefault();
                                     e.dataTransfer.dropEffect = "copy";
                                 } }>
                                <div className="dragHereNotice">
                                    Drag here to remove a card from your deck
                                </div>
                        </div>
                    }

                </div>
            </div>

        </div>

        {
            changesMade ?
                <div className="saveChanges">
                    <NiceButton
                        onClick={ saveChanges }
                        text="Save Changes"
                    />
                </div> : null
        }

    </div>

}