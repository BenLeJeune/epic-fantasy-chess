import {legalMove, Move} from "../types";
import Piece from "./Piece";
import ActualMove from "./Move";

export default class Board {

    static getLegalMoves : ( board : number[], history : ActualMove[], options : Partial<LegalMoveOptions> ) => legalMove[] = ( board, history, options = {} ) => {

        let fullOptions = Object.assign({
            mode: "all", colour: 0, ignore: []
        }, options) as LegalMoveOptions;

        let moves = [] as legalMove[]

        board.map( (piece, position) => [ piece, position ] )
            .filter( piece => ( piece[0] > 0 && fullOptions.colour > 0 ) || ( piece[0] < 0 && fullOptions.colour < 0 ) )
            .filter( ([ piece, position ]) => fullOptions.ignore.indexOf( position ) === -1 )
            .forEach(( [ piece, position ] ) => {
                if ( piece === Piece.None ) return;
                let pieceObject = Piece.getPiece( piece );
                if ( pieceObject === null ) return;
                let pieceMoves = pieceObject.getLegalMoves( position, board, fullOptions.mode, fullOptions.colour, history );
                moves.push( ...pieceMoves );
        });

        //Pushes each of the moves
        return moves;

    }

    static isThreatened : ( position : number, board : number[], history : ActualMove[], colour : number ) => boolean = ( position, board, history, colour ) => {

        //This will be used to determine if a given square is threatened.
        return Board.getThreats( position, board, history, colour ).length > 0;

    }

    static getThreats : ( position : number, board : number[], history : ActualMove[], colour? : number ) => legalMove[] = ( position, board, history, colour = -board[position] ) => {
        return Board.getLegalMoves(
            board, history, { mode: "all", colour }
        ).filter( move => move.to === position );
    }

}

type LegalMoveOptions = {
    mode: "all" | "captures" |  "moves",
    colour: number,
    ignore: number[]
}

