///
/// CHECKS
///

import Piece from "../Classes/Piece";
import {legalMove, Move} from "../types";
import ActualMove from "../Classes/Move";
import Board from "../Classes/Board";
import Game from "../Classes/Game";

///
/// IS THIS COLOUR'S KING IN CHECK?
///
const isCheck : ( board:number[], history:ActualMove[], colour: number ) => boolean = ( board, history, colour ) => {

    //Determine the king's square

    let wKing = board.indexOf( Piece.King );
    let bKing = board.indexOf( -Piece.King );

    if ( wKing === -1 || bKing === -1) return false;

    let pos = colour > 0 ? wKing : bKing;

    let legalMoves = Board.getLegalMoves(
        board, history, { mode: "captures", colour: -colour } )

    //Are there any attacks on the king?
    return legalMoves.filter( move => move.to === pos ).length > 0;

}

const filterLegalMoves : ( moves: legalMove[], board : number[], history:ActualMove[], colour : number ) => legalMove[] = ( moves, board, history, colour ) => {

    let game = new Game( board , history );

    let filtered = moves.filter( move => {

        //THERE ARE SOME SPECIAL RULES FOR SPECIAL MOVES
        if ( move.special === "CASTLE") {
            if ( isCheck( game.getBoard(), history, colour ) ) return false; //Cannot castle out of check
            let kingsRook = colour > 0 ? 7 : 63;
            let queensRook = colour > 0 ? 0 : 56;
            if ( move.to === kingsRook - 1 && Board.isThreatened( kingsRook - 2, game.getBoard(), history, -colour )) return false;
            if ( move.to === queensRook + 2 && Board.isThreatened( queensRook + 3, game.getBoard(), history, -colour ) ) return false;
        }

        //First, let's make the move.
        game.Move( move.from, move.to, move.special );
        //Now, let's see if there is a check.
        let stillInCheck = isCheck( game.getBoard(), history, colour );
        //Then, we unmake the move.
        game.UnMove();
        return !stillInCheck;
    } )

    return filtered

}

export {
    isCheck,
    filterLegalMoves
}

