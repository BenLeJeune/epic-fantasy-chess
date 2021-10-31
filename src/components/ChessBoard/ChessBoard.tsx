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
import {filterLegalMoves} from "../../helpers/Checks";
import PiecePromotionUI from "../PiecePromotionUI/PiecePromotionUI";

interface Props {
    board : number[],
    currentTurn : number,
    move : ( from : number, to : number, special? : SpecialMove, additional? : object ) => void,
    unMove : () => void,
    moves : ActualMove[],
    whiteCaptured : number[],
    blackCaptured : number[],
    capturePiece : ( p:number ) => void,
    whiteArmy: number[],
    blackArmy: number[],
    playerColour : number,
    activePlayer : number,
    opponentActive : boolean,
    gameUUID: string
}

export default function ChessBoard({ board, currentTurn, move, unMove, moves, whiteCaptured, blackCaptured, capturePiece, whiteArmy, blackArmy, playerColour, activePlayer, opponentActive, gameUUID } : Props) {

    //Whether or not the board needs to be rotated
    const rotated = activePlayer === -1 && !opponentActive;

    const [DEV_MODE_ENABLED] = useState(gameUUID === "dev-playground");

    ///
    /// MOVING & CAPTURING
    ///

    //THIS HANDLES MOVING
    const onDrop = ( ev : React.DragEvent, destination : number, special?: SpecialMove ) => {
        let [ piece, position ] = JSON.parse( ev.dataTransfer.getData("text/plain") ) as [number, number];

        if ( Math.abs(piece) === Piece.Pawn && Piece.getRank( destination ) === ( piece > 0 ? 7 : 0 ) ) {
            setPromotion([ position, destination ]);
            let captured = special === "EP" ? board[destination - 8] : board[destination];
            if ( captured !== Piece.None ) capturePiece( captured );
            return;
        }

        let captured = special === "EP" ? board[destination - 8] : board[destination];

        move( position, destination, special );
        setTargeting([0, 0])
    }

    ///
    /// PROMOTING
    ///
    const onPromotion = ( pieceFrom : number, pieceTo : number, positionFrom : number, positionTo : number ) => {

        move( positionFrom, positionTo, "PROMOTION", { promotionTo: pieceTo }  );
        setPromotion([ -1, -1 ])

    }


    ///
    /// GENERATING UI ELEMENTS
    ///

    const getSquares = () => board.map( (piece, pos) => <ChessSquare position={pos} rotated={rotated}
                                         highlight={ moves.length >= 1 && ( pos === moves[moves.length - 1].to || pos === moves[moves.length - 1].from ) } /> )

    const getPieceKey = ( piece : number, pos : number ) => {
        //We will return simply the piece and its position
        //UNLESS it has been moved
        //WE LOOK THROUGH THE MOVES TO FIND IT'S LAST MOVE
        let startingPos = pos;
        if ( moves.length > 0 ) {
            let inverseMoves = [...moves].reverse();
            //GO THROUGH EACH MOVE, AND TRACK THE POSITION OF THIS PIECE
            startingPos = inverseMoves.reduce( ( p, m ) => m.to === p && m.moving === piece ? m.from : p , pos );

            if ( Math.abs( piece ) === Piece.Rook || Math.abs( piece ) === Piece.Bede ) { //If a rook, we also want to retain it for castling
                startingPos = inverseMoves.reduce(
                    ( p, m ) => {
                        let regularMove = ( m.to === p && m.moving === piece );
                        let castle = ( m.special === "CASTLE" && ( m.to === p + 1 || m.to === p - 1 ) );
                        if ( regularMove ) return m.from
                        else if (castle && Math.abs(piece) === Piece.Bede) return m.to === p + 1 ? m.to + 1 : m.to - 1;
                        else if ( castle ) return m.to === p + 1 ? m.to + 1 : m.to - 2;
                        else return p
                    }, pos
                );
            }

        }

        return `${ startingPos }-${ piece }`
    }

    const getPieces = () => board.map( ( piece, pos ) => piece === 0 ? null :
        <ChessPiece position={ pos }
                    key={ getPieceKey( piece, pos ) }
                    piece={ piece }
                    id={ getPieceKey( piece, pos ) }
                    draggable={ (currentTurn > 0 && piece > 0 && (playerColour > 0|| !opponentActive)) || ( currentTurn < 0 && piece < 0 && (playerColour < 0 || !opponentActive) ) || DEV_MODE_ENABLED }
                    target={ () => setTargeting([ piece, pos ])  }
                    unTarget={ () => setTargeting([ 0, -1 ]) }
                    active={ targeting[1] === pos || targeting[1] === -1 }
                    rotated={rotated} /> )

    const getTargetingSquares = () => Piece.getPiece( targeting[0] ) ?
        filterLegalMoves(
            (Piece.getPiece( targeting[0] ) as GamePiece).getLegalMoves( targeting[1], board, "all", targeting[0] > 0 ? 1 : -1, moves ),
            board, moves, targeting[0] > 0 ? 1 : -1
        )
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
    const [ targeting, setTargeting ] = useState<[ number, number ]>([ 0, -1 ]);


    ///
    /// PROMOTING
    ///
    // Will be -1 when not shown
    const [ [ promotionFrom, promotionTo ], setPromotion ] = useState<[ number, number ]>([ -1, -1 ]);

    const getValidPromotionPieces = ( colour: -1 | 1 ) => {
        let pieces = colour > 0 ? whiteArmy : blackArmy;
        console.log(colour)
        //We want to remove duplicates
        let filtered = pieces.filter(p => Math.abs(p) !== Piece.King)
            .reduce(( acc, cur ) => acc.indexOf( cur ) === -1 ? [ ...acc, cur ] : acc, [] as number[]);
        return filtered.sort( (a, b) => a - b ).map( piece => colour > 0 ? piece : -piece )
    }

    return <>
        <InfoBar captures={ blackCaptured } evaluation={ -materialEvaluation( board ) }/>
        <div id="ChessBoardWrapper">
            <div id="ChessBoardOuter">

                <div id="ChessBoardSquares" className="board">
                    { getSquares() }
                </div>

                {
                  targeting[0] !== 0 ? <div id="ChessBoardTargeting" className="board">
                      { getTargetingSquares() }
                  </div> : null
                }

                <div id="ChessBoardPieces" className={`board ${ targeting[0] !== 0 ? "targeting" : "" }`}>
                    { getPieces() }
                </div>

                {
                    promotionFrom !== -1 ? <PiecePromotionUI above={Piece.getRank( promotionTo ) === 7}
                            positionFrom={promotionFrom}
                            positionTo={promotionTo}
                            validPieces={ getValidPromotionPieces( board[promotionFrom] > 0 ? 1 : -1 ) }
                            promoting={promotionFrom > 0 ? board[promotionFrom] : Piece.None}
                            callback={onPromotion}
                            rotated={ rotated }
                    /> : null
                }

            </div>
        </div>
        <InfoBar captures={ whiteCaptured } evaluation={ materialEvaluation( board ) }/>
    </>

}