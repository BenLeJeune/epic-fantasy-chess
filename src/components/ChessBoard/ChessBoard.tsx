import React, {useState} from 'react';
import ChessSquare from "../ChessSquare/ChessSquare";
import "./ChessBoard.css"
import ChessPiece from "../ChessPiece/ChessPiece";
import Piece from "../../Classes/Piece";
import Game from "../../Classes/Game";
import TargetingSquare from "../TargetingSquare/TargetingSquare";
import GamePiece from "../../Pieces/GamePiece";

interface Props {
    board : number[],
    currentTurn : number,
    move : ( from : number, to : number ) => void,
    unMove : () => void
}

export default function ChessBoard({ board, currentTurn, move, unMove } : Props) {

    const onDrop = ( ev : React.DragEvent, destination : number ) => {

        let [ piece, position ] = JSON.parse( ev.dataTransfer.getData("text/plain") ) as [number, number];
        move( position, destination );

    }

    const getSquares = () => board.map( (piece, pos) => <ChessSquare position={pos} /> )

    const getPieces = () => board.map( ( piece, pos ) => piece === 0 ? null :
        <ChessPiece position={ pos }
                    piece={ piece }
                    target={ () => setTargeting([ piece, pos ])  }
                    unTarget={ () => setTargeting([ 0, 0 ]) }
                    active={ targeting[1] === pos || targeting[1] === 0 } /> )

    const getTargetingSquares = () => Piece.getPiece( targeting[0] ) ?
        (Piece.getPiece( targeting[0] ) as GamePiece).getLegalMoves( targeting[0], board, "all", targeting[0] > 0 ? 1 : -1 )
            .map( move =>
                <TargetingSquare
                    position={ move.to }
                    isCapture={ false }
                    isMove={ true }
                    onDrop={ ev => onDrop( ev, move.to ) }
                />
            )
        : null;



    ///
    /// TARGETING
    ///
    // [ piece, position from ]
    const [ targeting, setTargeting ] = useState<[ number, number ]>([ 0, 0 ]);

    return <>
        <div id="ChessBoardWrapper">
            <div id="ChessBoardOuter">

                <div id="ChessBoardSquares" className="board">
                    { getSquares() }
                </div>

                {
                  targeting[0] !== 0 ?<div id="ChessBoardTargeting" className="board">
                      { getTargetingSquares() }
                  </div> : null
                }

                <div id="ChessBoardPieces" className={`board ${ targeting[0] !== 0 ? "targeting" : "" }`}>
                    { getPieces() }
                </div>

            </div>
        </div>
    </>

}