import GamePiece from "../GamePiece";
import {Move, legalMove, SpecialMove} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import { pawnGrid } from "../ValueGrids";

export default class Pawn extends GamePiece {

    //eval
    public materialValue = 1;
    public engineValue = 100;
    public valueGrid = pawnGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Pawn.shortName;
    public longName = Pawn.longName;
    public static shortName = "P";
    public static longName = "Pawn";

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number, history : ActualMove[]) => legalMove[] = ( position, board, mode, colour = 1, history ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[]

        // PAWN MOVES
        if ( mode !== "captures" ) {
            if ( Piece.getRank( position ) === 1 || Piece.getRank( position ) === 6 ) moves.push(...getLegalRiderMoves(
                board, position, Piece.Pawn * colour, [
                    p => colour > 0 ? p + 8 : p - 8
                ], "moves", 2
            ).map( m => Math.abs( m.from - m.to ) === 16 ? { ...m, special : "DOUBLE" as SpecialMove } : m ))
            else moves.push(...getLegalSingleMoves(
                board, position, Piece.Pawn * colour, [
                    p => colour > 0 ? p + 8 : p - 8
                ], "moves"
            ))
        }

        // PAWN CAPTURES
        if ( mode !== "moves" ) {
            moves.push(...getLegalSingleMoves(
                board, position, Piece.Pawn * colour, colour > 0 ? [
                    p => Piece.getFile(position) !== 0 ? p + 7 : p, //Capturing for White
                    p => Piece.getFile(position) !== 7 ? p + 9 : p,
                ] : [
                    p => Piece.getFile(position) !== 0 ? p - 9 : p, //Capturing for White
                    p => Piece.getFile(position) !== 7 ? p - 7 : p,
                ], "captures"
            ))

            //IF THE LAST MOVE WAS A PAWN DOUBLE MOVE
            if ( history.length > 0 && history[ history.length - 1 ].special === "DOUBLE" ) {
                let lastMove = history[history.length - 1];
                if ( lastMove.to === position + 1 && Piece.getFile(position) !== 7 ) moves.push({
                    from: position, to: colour > 0 ? position + 9 : position - 7, special: "EP"
                });
                else if ( lastMove.to === position - 1 && Piece.getFile(position) !== 0 ) moves.push({
                    from: position, to:  colour > 0 ? position + 7 : position - 9, special: "EP"
                });

            }


        }

        return moves;

    }
}



