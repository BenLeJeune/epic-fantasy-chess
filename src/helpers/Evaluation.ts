///
/// EVALUATIONS
///

import Piece from "../Classes/Piece";
import GamePiece from "../Pieces/GamePiece";
import {filterLegalMoves, isCheck} from "./Checks";
import ActualMove from "../Classes/Move";
import {legalMove} from "../types";
import {PromotionMove} from "../WebWorker/IncludePromotions";
import Board from "../Classes/Board";
import {arraysAreEqual} from "./Utils";
import OngoingEffect from "../Classes/OngoingEffect";

const materialEvaluation = (board : number[] ) => {
    return board.filter(p => p !== Piece.None).reduce((t, piece) => {
        if (Piece.getPiece(piece) === null) return t;
        else if (piece > 0) return t + (Piece.getPiece(piece) as GamePiece).materialValue; //Positive for white
        else if (piece < 0) return t - (Piece.getPiece(piece) as GamePiece).materialValue; //Negative for black
        else return t;
    }, 0);
}

const positionalEngineEvaluation = ( board : number[], history: ActualMove[], pieceIndexes?: number[], _pieces?: (GamePiece|null)[], effects?: OngoingEffect[] ) => {


    let startTime = performance.now();

    if ( isCheck( board, history, 1, undefined, pieceIndexes  )){
        let wMoves =  filterLegalMoves( Board.getLegalMoves( board, history, { colour: 1 } ), board, history, 1, effects || [] );
        //If white is checkmated, return negative infinity.
        if ( wMoves.length === 0 ) return Number.NEGATIVE_INFINITY
    }
    else if ( isCheck( board, history, -1, undefined, pieceIndexes )) {
        let bMoves = filterLegalMoves( Board.getLegalMoves( board, history, { colour: -1 }, pieceIndexes ), board, history, -1, effects || [] );
        //If black mated, return infinity
        if ( bMoves.length === 0 ) return Number.POSITIVE_INFINITY
    }

    let val = 0;

    if (pieceIndexes) {
        /*val = pieceIndexes.reduce(( t, pos ) => {
            const p = Piece.getPiece(board[pos]) as GamePiece;
            if ( !p ) return t;
            else {
                let value = p.engineValue;
                if ( board[pos] > 0 ) {  //A White Piece
                    value += p.valueGrid[ 63 - pos ];
                    return t + value;
                }
                else {  //A black piece
                    value += p.valueGrid[pos];
                    return t - value;
                }
            }
        }, 0)*/
        let i = 0, len = pieceIndexes.length;
        let pieces = _pieces || Piece.PIECE_OBJECTS;
        while ( i < len ) {
            let index = pieceIndexes[i];
            const p = pieces[ Math.abs(board[index]) ];
            if (p) {
                let value = p.engineValue
                if ( board[index] > 0 ) {
                    val += value + p.valueGrid[63 - index]
                }
                else val -= ( value + p.valueGrid[index] )       ;
            }
            i++
        }
    }
    else {
        /*val = board.filter( p => p !== Piece.None ).reduce(( t, piece, pos ) => {
            const p = Piece.getPiece(piece) as GamePiece;
            if ( !p ) return t;
            else {
                let value = p.engineValue;
                if ( piece > 0 ) {  //A White Piece
                    value += p.valueGrid[ 63 - pos ];
                    return t + value;
                }
                else {  //A black piece
                    value += p.valueGrid[pos];
                    return t - value;
                }
            }
        }, 0);*/
        let i = 0, len = board.length;
        let pieces = _pieces || Piece.PIECE_OBJECTS;
        while ( i < len ) {
            let index = i;
            const p = pieces[ Math.abs(board[index]) ];
            if (p) {
                let value = p.engineValue
                if ( board[index] > 0 ) {
                    val += value + p.valueGrid[63 - index]
                }
                else val -= ( value + p.valueGrid[index] )       ;
            }
            i++
        }
    }

    let endTime = performance.now();

    let elapsed = endTime - startTime;
    if (elapsed > 5) {
        console.log(`Took ${ elapsed } ms to evaluate after ${ history[history.length - 1].getMoveName() }`);
    }

    return val
}


export {
    materialEvaluation,
    positionalEngineEvaluation
}