import GamePiece from "../GamePiece";
import {Move, legalMove} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import { knightGrid } from "../ValueGrids";

export default class Waffle extends GamePiece {

    //eval
    public materialValue = 3;
    public engineValue = 300;
    public valueGrid = knightGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Waffle.shortName;
    public longName = Waffle.longName;
    public static shortName = "WA";
    public  static longName = "Waffle";


    public movesDescription = "Can move one square horizontally/vertically, or leap two squares diagonally.";
    public specialMoves = [
        ""
    ]
    public notes = "Can leap over pieces.";

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[] = ( position, board, mode, colour = 1 ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[];
        moves.push( ...getLegalSingleMoves(
            board, position, Piece.Waffle * colour, [
                //Rookwise moves
                p => Piece.getRank(p) >= 1 ? p - 8 : p, p => Piece.getRank(p) <= 6 ? p + 8 : p,
                p => Piece.getFile(p) >= 1 ? p - 1 : p, p => Piece.getFile(p) <= 6 ? p + 1 : p,
                //Bishopwise moves
                p => Piece.getRank(p) <= 5 && Piece.getFile(p) <= 5 ? p + 18 : p, //up & right
                p => Piece.getRank(p) <= 5 && Piece.getFile(p) >= 2 ? p + 14 : p, //up & left
                p => Piece.getRank(p) >= 2 && Piece.getFile(p) <= 5 ? p - 14 : p, //down & right
                p => Piece.getRank(p) >= 2 && Piece.getFile(p) >= 2 ? p - 18 : p //down & left
            ], mode
        ) )

        return moves;

    }

}