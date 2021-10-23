import GamePiece from "../GamePiece";
import {Move, legalMove, tag} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import {isCheck} from "../../helpers/Checks";
import Board from "../../Classes/Board";
import {kingGrid} from "../ValueGrids";

export default class King extends GamePiece {

    //eval
    public materialValue = 999;
    public engineValue = 20000;
    public valueGrid = kingGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = King.shortName;
    public longName = King.longName;
    public static shortName = "K";
    public static longName = "King"

    public movesDescription = "Moves one square in any direction.";
    public specialMoves = [
        "If a Castler and this piece have not moved, and you don't pass through check to do so, you may move the king two squares towards the castler, placing the castler on the other side."
    ]
    public notes = "Cannot move into check, and if possible must move out of check. If checkmated, you lose the game.";
    public categories = [ "Major", "King" ] as tag[];

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number, history : ActualMove[]) => legalMove[] = ( position, board, mode, colour = 1, history ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[];
        moves.push( ...getLegalSingleMoves(
            board, position, Piece.King * colour, [
                p => Piece.getFile(p) !== 0 ? p + 7 : p, p => Piece.getFile(p) !== 0 ? p - 9 : p,
                p => Piece.getFile(p) !== 7 ? p + 9 : p, p => Piece.getFile(p) !== 7 ? p - 7 : p,
                p => Piece.getRank(p) !== 0 ? p - 8 : p, p => Piece.getFile(p) !== 0 ? p - 1 : p,
                p => Piece.getRank(p) !== 7 ? p + 8 : p, p => Piece.getFile(p) !== 7 ? p + 1 : p,
            ], mode
        ) );

        //We also want to allow for castling
        const originalSquare = colour > 0 ? 4 : 60; //e1 or e8
        const queensRook = colour > 0 ? 0 : 56; //a1 or a8
        const kingsRook = colour > 0 ? 7 : 63; //h1 or h8

        //If the king is still in his original square (AND NOT CURRENTLY IN CHECK)
        if ( position === originalSquare ) {

            //Has the king been moved at all yet?
            let kingMoves = history.filter( move => move.moving === Piece.King * colour || move.captured === Piece.King * colour );

            if ( kingMoves.length === 0 ) {

                //Has the king's rook been moved at all yet?
                if ( board[kingsRook] === Piece.Rook * colour && board[kingsRook -1] === Piece.None && board[kingsRook - 2] === Piece.None ) {

                    let krMoves = history.filter( move => move.from === kingsRook || move.to === kingsRook );
                    if ( krMoves.length === 0)  moves.push({
                        from: originalSquare,
                        to: kingsRook - 1,
                        special: "CASTLE"
                    });
                }

                //Has the queen's rook been moved at all yet?

                if ( board[queensRook] === Piece.Rook * colour && board[queensRook + 1] === Piece.None && board[queensRook + 2] === Piece.None
                    && board[queensRook + 3] === Piece.None ) {

                    let qrMoves = history.filter( move => move.from === queensRook || move.to === queensRook );
                    if ( qrMoves.length === 0)  moves.push({
                        from: originalSquare,
                        to: queensRook + 2,
                        special: "CASTLE"
                    });
                }

            }


        }



        return moves;

    }

}