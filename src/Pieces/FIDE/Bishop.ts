import GamePiece from "../GamePiece";
import {legalMove, Move, tag} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import {bishopGrid} from "../ValueGrids";

export default class Bishop extends GamePiece {

    //eval
    public materialValue = 3;
    public engineValue = 330;
    public valueGrid = bishopGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Bishop.shortName;
    public longName = Bishop.longName;
    public static shortName = "B";
    public static longName = "Bishop";

    public movesDescription = "Moves any number of squares diagonally.";
    public specialMoves = []
    public notes = "Is colour-bound.";
    public categories = [ "Minor", "Bishop", "Colour-bound", "FIDE" ] as tag[];

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[] = ( position, board, mode, colour = 1 ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[];
        moves.push( ...getLegalRiderMoves(
            board, position, Piece.Bishop * colour, [
                p => Piece.getFile(p) !== 0 ? p + 7 : p, p => Piece.getFile(p) !== 0 ? p - 9 : p,
                p => Piece.getFile(p) !== 7 ? p + 9 : p, p => Piece.getFile(p) !== 7 ? p - 7 : p,
            ], mode
        ) )

        return moves;

    }

}