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

const materialEvaluation = (board : number[] ) => {
    return board.filter(p => p !== Piece.None).reduce((t, piece) => {
        if (Piece.getPiece(piece) === null) return t;
        else if (piece > 0) return t + (Piece.getPiece(piece) as GamePiece).materialValue; //Positive for white
        else if (piece < 0) return t - (Piece.getPiece(piece) as GamePiece).materialValue; //Negative for black
        else return t;
    }, 0);
}

const positionalEngineEvaluation = ( board : number[], history: ActualMove[] ) => {


    let wMoves =  filterLegalMoves( Board.getLegalMoves( board, history, { colour: 1 } ), board, history, 1 );
    let bMoves = filterLegalMoves( Board.getLegalMoves( board, history, { colour: -1 } ), board, history, -1 );

    if ( isCheck( board, history, 1  ) && wMoves.length === 0){
        //If white is checkmated, return negative infinity.
        return Number.NEGATIVE_INFINITY
    }
    else if ( isCheck( board, history, -1 ) && bMoves.length === 0 ) {
        //If black mated, return infinity
        return Number.POSITIVE_INFINITY
    }

    let e =  board.filter( p => p !== Piece.None ).reduce(( t, piece, pos ) => {
        if ( !Piece.getPiece(piece) ) return t;
        else {
            const p = Piece.getPiece(piece) as GamePiece;
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
    }, 0)

    return e;
}


export {
    materialEvaluation,
    positionalEngineEvaluation
}