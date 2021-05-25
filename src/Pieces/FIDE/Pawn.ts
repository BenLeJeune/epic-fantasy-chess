import GamePiece, {legalMove} from "../GamePiece";
import {Move} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";

export default class Pawn extends GamePiece {

    //eval
    public materialValue = 1;
    public engineValue = 1;
    public valueGrid = [];
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Pawn.shortName;
    public longName = Pawn.longName;
    public static shortName = "P";
    public static longName = "Pawn";

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[] = ( position, board, mode, colour = 1 ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[]

        // PAWN MOVES
        if ( mode !== "captures" ) moves.push( ...getLegalSingleMoves(
            board, position, Piece.Pawn * colour, [
                p => colour > 0 ? p + 8 : p - 8
            ], "moves"
        ) )

        // PAWN CAPTURES
        if ( mode !== "moves" ) moves.push( ...getLegalSingleMoves(
            board, position, Piece.Pawn * colour, colour > 0 ? [
                p => Piece.getFile(position) !== 0 ? p + 7 : p, //Capturing for White
                p => Piece.getFile(position) !== 7 ? p + 9 : p,
            ] : [
                p => Piece.getFile(position) !== 0 ? p - 9 : p, //Capturing for White
                p => Piece.getFile(position) !== 7 ? p - 7 : p,
            ], "captures"
        ) )

        return moves;

    }
}



