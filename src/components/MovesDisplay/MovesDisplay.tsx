import React from 'react';
import ActualMove from "../../Classes/Move";
import "./MovesDisplay.css";

interface props {
    moves : ActualMove[],
    unMove : () => void,
    canUndo: boolean
}

export default function MovesDisplay({ moves, unMove, canUndo } : props ) {

    return <>
        <div id="BoardMovesDisplay">
            {
                moves.map(
                    ( move, i ) => <p className="move" key={`${move.from}${move.to}${i}`}>
                        <span>{ move.getMoveName() }</span>
                    </p>

                )
            }
            {
                !canUndo ? null :
                    <button className="unMakeMove" onClick={unMove}>
                        UnMove!
                    </button>
            }
        </div>
    </>

}