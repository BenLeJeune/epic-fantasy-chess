import GamePiece, {legalMove} from "../GamePiece";
import {Move} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";

export default class King extends GamePiece {

    //eval
    public materialValue = 999;
    public engineValue = 999;
    public valueGrid = [];
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = King.shortName;
    public longName = King.longName;
    public static shortName = "K";
    public static longName = "King"

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[] = ( position, board, mode, colour = 1 ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[];
        moves.push( ...getLegalSingleMoves(
            board, position, Piece.King * colour, [
                p => Piece.getFile(p) !== 0 ? p + 7 : p, p => Piece.getFile(p) !== 0 ? p - 9 : p,
                p => Piece.getFile(p) !== 7 ? p + 9 : p, p => Piece.getFile(p) !== 7 ? p - 7 : p,
                p => Piece.getRank(p) !== 0 ? p - 8 : p, p => Piece.getFile(p) !== 0 ? p - 1 : p,
                p => Piece.getRank(p) !== 7 ? p + 8 : p, p => Piece.getFile(p) !== 7 ? p + 1 : p,
            ], mode
        ) )

        return moves;

    }

}