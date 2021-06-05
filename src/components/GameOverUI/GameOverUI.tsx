import React, {useEffect, useState} from 'react';
import "./GameOverUI.css";

interface Props {
    winner : number,
    message : string
}

export default function GameOverUI( { winner, message } : Props ) {

    const [ shown, setShown ] = useState(false)

    useEffect(() => {
        setTimeout(() => setShown(true), 500)
    })

    const getScoreMessage = () => {
        switch (winner) {
            case 1:
                return "1-0"
            case -1:
                return "0-1"
            case 0:
            default:
                return "0.5-0.5"
        }
    }

    const getWinnerMessage = () => {
        switch (winner) {
            case 1:
                return "White wins"
            case -1:
                return "Black wins"
            case 0:
            default:
                return "Draw"
        }
    }

    const onPlayAgain = () => {
        window.location.reload()
    }

    return <div id="GameOverUI" className={ `${winner < 0 ? "black" : "white"} ${ shown ? "shown" : "hidden" }` } >
        <div id="GameOverHeader">
            <h2 className="scoreMessage">{ getScoreMessage() }</h2>
            <p className="winnerMessage">{ getWinnerMessage() }</p>
        </div>
        <div id="GameOverBody">
            <p>{ message }</p>
        </div>

        <button onClick={ onPlayAgain } >Play Again?</button>
    </div>

}