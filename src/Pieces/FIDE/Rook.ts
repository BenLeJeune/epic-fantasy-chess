import GamePiece from "../GamePiece";
import {Move, legalMove, tag} from "../../types";
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

    public movesDescription = "Moves any number of squares diagonally or vertically.";
    public specialMoves = [
        "If this starts on the first or eighth file, neither pieces have moved, and this doesn't cause the king to move through check, can \"castle\" with the king."
    ]
    public notes = "";
    public categories = [ "Major", "Rook", "Castler", "FIDE" ] as tag[];

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