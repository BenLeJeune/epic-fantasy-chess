import React from 'react';
import ActualMove from "../../Classes/Move";
import "./MovesDisplay.css";

interface props {
    moves : ActualMove[],
    unMove : () => void
}

export default function MovesDisplay({ moves, unMove } : props ) {

    return <>
        <div id="BoardMovesDisplay">
            {
                moves.map(
                    move => <p className="move" key={`${move.from}${move.to}`}>
                        <span>{ move.getMoveName() }</span>
                    </p>

                )
            }
            <button className="unMakeMove" onClick={ unMove }>
                UnMove!
            </button>
        </div>
    </>

}