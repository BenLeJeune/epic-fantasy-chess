import GamePiece from "../GamePiece";
import {Move, legalMove, SpecialMove, tag} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import { pawnGrid } from "../ValueGrids";

export default class DummyPawn extends GamePiece {

    //eval
    public materialValue = 0.5;
    public engineValue = 25;
    public valueGrid = pawnGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = DummyPawn.shortName;
    public longName = DummyPawn.longName;
    public static shortName = "¬P";
    public static longName = "Dummy Pawn";

    public movesDescription = "Moves one square directly forward."
    public specialMoves = [ ]
    public notes = "Cannot capture or promote"
    public categories = [ "Minor", "Pawn", "Token" ] as tag[];

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

        return moves;

    }
}



