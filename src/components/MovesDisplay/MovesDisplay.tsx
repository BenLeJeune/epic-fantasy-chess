import React from 'react';
import ActualMove from "../../Classes/Move";

interface props {
    moves : ActualMove[],
    unMove : () => void
}

export default function MovesDisplay({ moves, unMove } : props ) {

    return <div id="boardMovesDisplay">
        {
            moves.map(
                move => <p className="move" key={`${move.from}${move.to}`}>
                    { move.getMoveName() }
                </p>

            )
        }
    </div>

}