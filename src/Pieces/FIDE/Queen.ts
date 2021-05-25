import GamePiece from "../GamePiece";
import {legalMove, Move} from "../../types";
import {getLegalRiderMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";

export default class Queen extends GamePiece {

    //eval
    public materialValue = 9;
    public engineValue = 9;
    public valueGrid = [];
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Queen.shortName;
    public longName = Queen.longName;
    public static shortName = "Q";
    public static longName = "Queen";

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[] = ( position, board, mode, colour = 1 ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[];
        moves.push( ...getLegalRiderMoves(
            board, position, Piece.Queen * colour, [
                p => Piece.getFile(p) !== 0 ? p + 7 : p, p => Piece.getFile(p) !== 0 ? p - 9 : p,
                p => Piece.getFile(p) !== 7 ? p + 9 : p, p => Piece.getFile(p) !== 7 ? p - 7 : p,
                p => Piece.getRank(p) !== 0 ? p - 8 : p, p => Piece.getFile(p) !== 0 ? p - 1 : p,
                p => Piece.getRank(p) !== 7 ? p + 8 : p, p => Piece.getFile(p) !== 7 ? p + 1 : p,
            ], mode
        ) )

        return moves;

    }

}