import GamePiece from "../GamePiece";
import {Move, legalMove} from "../../types";
import {getLegalRiderMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import {rookGrid} from "../ValueGrids";

export default class Rook extends GamePiece {

    //eval
    public materialValue = 5;
    public engineValue = 500;
    public valueGrid = rookGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Rook.shortName;
    public longName = Rook.longName;
    public static shortName = "R";
    public static longName = "Rook";

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[] = ( position, board, mode, colour = 1 ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[];
        moves.push( ...getLegalRiderMoves(
            board, position, Piece.Rook * colour, [
                p => Piece.getRank(p) !== 0 ? p - 8 : p, p => Piece.getFile(p) !== 0 ? p - 1 : p,
                p => Piece.getRank(p) !== 7 ? p + 8 : p, p => Piece.getFile(p) !== 7 ? p + 1 : p,
            ], mode
        ) )

        return moves;

    }

}