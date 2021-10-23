import GamePiece from "../GamePiece";
import {legalMove, Move, tag} from "../../types";
import {getLegalRiderMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import {queenGrid} from "../ValueGrids";

export default class Queen extends GamePiece {

    //eval
    public materialValue = 9;
    public engineValue = 900;
    public valueGrid = queenGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Queen.shortName;
    public longName = Queen.longName;
    public static shortName = "Q";
    public static longName = "Queen";

    public movesDescription = "Moves any number of squares diagonally, horizontally and vertically - combining the moves of the Rook and the Bishop.";
    public specialMoves = []
    public notes = "";
    public categories = [ "Major", "Queen", "FIDE" ] as tag[];

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