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

    const getCardLibrary = () => Object.values(ALL_CARDS).map(
        ( card, i ) => <div className={`libraryCard ${getDeckQuantity(card.id) >= 2 ? "disabled" : ""}`} draggable={getDeckQuantity(card.id) < 2} onDragStart={e => onDragStart(e, card.id, "lib")} onDragEnd={onDragEnd}>
            <div>
                <div className="cardChaosScore">
                    <div className="score">{ card.cost }</div>
                    <div className="speed">{ card.fast ? "Fast" : "" }</div>
                </div>
                <div className="cardTitle">
                    { card.cardName }
                </div>
                <div className="cardDescription">
                    { card.description }
                </div>
                <div className="cardExpac">
                    {card.expac}
                </div>
            </div>
            {
                getDeckQuantity(card.id) >= 2 ? <>
                    <div className="limitReached limitBackground"/>
                    <div className="limitReached limitText">
                    Maximum number of copies reached
                </div></>: null
            }
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
        let cont = true;
        if ( deckCards.length !== 15 ) {
            cont = window.confirm("Your deck has an improper number of cards - you won't be able to play with it. Are you sure you want to continue?")
        }

        let decksJSON = localStorage.getItem(DECK_KEY);

        if (decksJSON && cont) {
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
                    <div className="counter">{deckCards.length}/15</div>
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