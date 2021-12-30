import React from "react";
import "./DecksPage.css"
import NiceButton from "../../components/NiceButton/NiceButton";
import NavBar from "../../components/NavBar/NavBar"
import { DECK_KEY } from "../../KEYS";
import {Deck, FIDEDECK} from "../../Presets/Decks";
import ALL_CARDS from "../../Cards/Cards";

export default function DecksPage() {

    const getDecks = () => {

        //Reading decks from local storage.
        let decks = [] as Deck[];

        let decksJSON = localStorage.getItem(DECK_KEY);
        if (decksJSON) {
            let parsedDecks = JSON.parse(decksJSON);
            Object.keys(parsedDecks).map(key => decks.push(parsedDecks[key]));
        }

        return decks;
    }

    const createNewDeck = () => {

        let deckJSON = localStorage.getItem(DECK_KEY);
        let name : string = "";

        if (deckJSON) {
            // Get the decks object from localStorage
            let decks = JSON.parse(deckJSON);
            //Ask for a name for the deck - defaults to "My Deck"
            name = prompt("Enter a name for your deck", "My Deck") || "My Deck"
            //If a deck of that name already exists, ask again!
            while ( decks[name] ) {
                name = prompt("That name has already been chosen") || "My Deck"
            }
            //Save to local storage with new army
            let newDecks = Object.assign({
                [ name ]: new Deck( [], name )
            }, decks)
            localStorage.setItem(DECK_KEY, JSON.stringify(newDecks) );
        }

        else {
            name = prompt("Enter a name for your deck", "My Deck") || "My Deck"
            let decks = {
                [ name ]: new Deck( [], name )
            }
            //Save this new item to local storage
            localStorage.setItem(DECK_KEY, JSON.stringify(decks));
        }

        //Then, we want to redirect to the army builer page for this army.

        window.location.href = `/decks/${ name }`;

    }

    const deleteDeck = ( deckName : string ) => {

        let deckJSON = localStorage.getItem(DECK_KEY);
        if (deckJSON) {

            let decks = JSON.parse(deckJSON);

            if (decks[deckName]) delete decks[deckName];

            localStorage.setItem(DECK_KEY, JSON.stringify(decks));

            window.location.reload();

        }

    }

    return <div id="DecksPage" className="paddedTop">

        <NavBar/>

        <h1 className="pageHeading">
            Your Decks
        </h1>
        <p className="pageSubtitle">Where you can view, edit, create and delete decks.</p>
        <p className="pageSubtitle">Click on a deck to edit it, hover over a deck to delete it.</p>

        <div className="decksButtonRow">
            <NiceButton onClick={ () => createNewDeck() } text="NEW DECK" buttonStyle="small"/>
        </div>

        <div className="decksListing">
            {
             getDecks().map(
                 deck => <DeckPreview deck={deck} deleteDeck={deleteDeck} />
             )
            }
        </div>

    </div>

}

interface DeckPreviewProps {
    deck: Deck,
    deleteDeck: ( deckName : string ) => void
}

export function DeckPreview({ deck, deleteDeck }: DeckPreviewProps) {

    const getDeckQuantity = ( cardId: string ) => deck.cards.filter(c => c === cardId).length

    return <div className="deckPreview"
                onClick={ () => window.location.href = `/decks/${ deck.name }` }
    >
        <div className="delete" onClick={ e => {
            e.stopPropagation();
            deleteDeck( deck.name );
        } }>
            ✖
        </div>

        <h3 className="DeckName">
            { deck.name }
        </h3>
        <div className="cards">
            { deck.cards.filter((c, i, a) => a.indexOf(c) === i).filter((c, i) => i <= 3).map(
                cardId => <p>{ ALL_CARDS[ cardId ].cardName || "name error" } x{ getDeckQuantity(cardId) }</p>
            ) }
            {
                deck.cards.filter((c, i, a) => a.indexOf(c) === i).length > 4 ? <p><i>Click to view more</i></p> : null
            }
        </div>
    </div>

}