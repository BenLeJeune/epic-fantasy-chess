import GamePiece from "../GamePiece";
import {Move, legalMove} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import { knightGrid } from "../ValueGrids";

export default class Knight extends GamePiece {

    //eval
    public materialValue = 3;
    public engineValue = 320;
    public valueGrid = knightGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Knight.shortName;
    public longName = Knight.longName;
    public static shortName = "N";
    public  static longName = "Knight";


    public movesDescription = "Two squares in one direction, then one perpendicular, forming an L-shape.";
    public specialMoves = [
        ""
    ]
    public notes = "Can leap over pieces.";

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