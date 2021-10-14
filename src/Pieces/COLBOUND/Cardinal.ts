import GamePiece from "../GamePiece";
import {legalMove, Move} from "../../types";
import {getLegalRiderMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import {queenGrid} from "../ValueGrids";
import Knight from "../FIDE/Knight";
import Bishop from "../FIDE/Bishop";

export default class Cardinal extends GamePiece {

    //eval
    public materialValue = 7;
    public engineValue = 700;
    public valueGrid = queenGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Cardinal.shortName;
    public longName = Cardinal.longName;
    public static shortName = "C";
    public static longName = "Cardinal";

    public movesDescription = "Moves any number of squares diagonally, or in an L-shape - combining the moves of the Knight and the Bishop.";
    public specialMoves = [
        ""
    ]
    public notes = "";

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[] = ( position, board, mode, colour = 1 ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[];
        moves.push( ...new Knight().getLegalMoves( position, board, mode, colour ) );
        moves.push(...new Bishop().getLegalMoves( position, board, mode, colour ))

        return moves;

    }

}