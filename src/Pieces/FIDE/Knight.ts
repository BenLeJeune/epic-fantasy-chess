import GamePiece from "../GamePiece";
import {Move, legalMove} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";

export default class Knight extends GamePiece {

    //eval
    public materialValue = 3;
    public engineValue = 3;
    public valueGrid = [];
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Knight.shortName;
    public longName = Knight.shortName;
    public static shortName = "N";
    public  static longName = "Knight";

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number, history : ActualMove[]) => legalMove[] = ( position, board, mode, colour = 1 ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[];
        moves.push( ...getLegalSingleMoves(
            board, position, Piece.Knight * colour, [
                p => Piece.getFile(p) >= 2 ? p + 6 : p, p => Piece.getFile(p) >= 2 ? p - 10 : p,
                p => Piece.getFile(p) <= 5 ? p + 10 : p, p => Piece.getFile(p) <= 5 ? p - 6 : p,
                p => Piece.getFile(p) >= 1 ? p + 15 : p, p => Piece.getFile(p) <= 6 ? p - 15 : p,
                p => Piece.getFile(p) <= 6 ? p + 17 : p, p => Piece.getFile(p) >= 1 ? p - 17 : p,
            ], mode
        ) )

        return moves;

    }

}