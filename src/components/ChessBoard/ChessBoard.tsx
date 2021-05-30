import React, {useEffect, useState} from 'react';
import ChessSquare from "../ChessSquare/ChessSquare";
import "./ChessBoard.css"
import ChessPiece from "../ChessPiece/ChessPiece";
import Piece from "../../Classes/Piece";
import Game from "../../Classes/Game";
import TargetingSquare from "../TargetingSquare/TargetingSquare";
import GamePiece from "../../Pieces/GamePiece";
import InfoBar from "../InfoBar/InfoBar";
import {materialEvaluation} from "../../helpers/Evaluation";
import ActualMove from "../../Classes/Move";
import {SpecialMove} from "../../types";

interface Props {
    board : number[],
    currentTurn : number,
    move : ( from : number, to : number, special? : SpecialMove ) => void,
    unMove : () => void,
    moves : ActualMove[],
    whiteCaptured : number[],
    blackCaptured : number[],
    capturePiece : ( p:number ) => void
}

export default function ChessBoard({ board, currentTurn, move, unMove, moves, whiteCaptured, blackCaptured, capturePiece } : Props) {

    ///
    /// MOVING & CAPTURING
    ///
    //
    // const [ whiteCaptured, setWhiteCaptured ] = useState<number[]>([]);
    // const [ blackCaptured, setBlackCaptured ] = useState<number[]>([]);
    // const capturePiece = ( p : number ) => {
    //     if ( p > 0 ) setBlackCaptured( prev => [ ...prev, p ] ) //We captured a white piece
    //     else if ( p < 0 ) setWhiteCaptured( prev => [ ...prev, p ] )
    // }

    //THIS HANDLES MOVING
    const onDrop = ( ev : React.DragEvent, destination : number, special?: SpecialMove ) => {
        let [ piece, position ] = JSON.parse( ev.dataTransfer.getData("text/plain") ) as [number, number];
        let captured = special === "EP" ? board[destination - 8] : board[destination];
        if ( captured !== Piece.None ) capturePiece( captured );
        move( position, destination, special );
        setTargeting([0, 0])
    }


    ///
    /// GENERATING UI ELEMENTS
    ///

    const getSquares = () => board.map( (piece, pos) => <ChessSquare position={pos}
                                         highlight={ moves.length >= 1 && ( pos === moves[moves.length - 1].to || pos === moves[moves.length - 1].from ) } /> )

    const getPieces = () => board.map( ( piece, pos ) => piece === 0 ? null :
        <ChessPiece position={ pos }
                    piece={ piece }
                    target={ () => setTargeting([ piece, pos ])  }
                    unTarget={ () => setTargeting([ 0, 0 ]) }
                    active={ targeting[1] === pos || targeting[1] === 0 } /> )

    const getTargetingSquares = () => Piece.getPiece( targeting[0] ) ?
        (Piece.getPiece( targeting[0] ) as GamePiece).getLegalMoves( targeting[1], board, "all", targeting[0] > 0 ? 1 : -1, moves )
            .map( move =>
                <TargetingSquare
                    position={ move.to }
                    isCapture={ board[move.to] !== Piece.None || move.special === "EP"}
                    isMove={ board[ move.to ] === Piece.None }
                    onDrop={ ev => onDrop( ev, move.to, move.special ) }
                />
            )
        : null;



    ///
    /// TARGETING
    ///
    // [ piece, position from ]
    const [ targeting, setTargeting ] = useState<[ number, number ]>([ 0, 0 ]);

    return <>
        <InfoBar captures={ blackCaptured } evaluation={ -materialEvaluation( board ) }/>
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
        <InfoBar captures={ whiteCaptured } evaluation={ materialEvaluation( board ) }/>
    </>

}