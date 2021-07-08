///
/// EVALUATIONS
///

import Piece from "../Classes/Piece";
import GamePiece from "../Pieces/GamePiece";

const materialEvaluation = (board : number[] ) => {
    return board.filter(p => p !== Piece.None).reduce((t, piece) => {
        if (Piece.getPiece(piece) === null) return t;
        else if (piece > 0) return t + (Piece.getPiece(piece) as GamePiece).materialValue; //Positive for white
        else if (piece < 0) return t - (Piece.getPiece(piece) as GamePiece).materialValue; //Negative for black
        else return t;
    }, 0);
}

const positionalEngineEvaluation = ( board : number[] ) => {
    return board.filter( p => p !== Piece.None ).reduce(( t, piece, pos ) => {
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
}


export {
    materialEvaluation,
    positionalEngineEvaluation
}