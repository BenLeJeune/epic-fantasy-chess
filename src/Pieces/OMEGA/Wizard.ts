import GamePiece from "../GamePiece";
import {legalMove, Move, tag} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import {knightGrid} from "../ValueGrids"

export default class Wizard extends GamePiece {

    //eval
    public materialValue = 4;
    public engineValue = 460;
    public valueGrid = knightGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & displaying
    public shortName = Wizard.shortName;
    public longName = Wizard.longName;
    public static shortName = "WI";
    public static longName = "Wizard";

    public movesDescription = "Leaps in an elongated knight move, three squares in one direction then one square perpendicular. Can also move one square diagonally.";
    public specialMoves = []
    public notes = "";
    public categories = [ "Minor", "Unique", "Omega" ] as tag[];

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[]
        = ( position, board, mode, colour = 1 ) => {

        let moves = [] as legalMove[];


        //Leap 2 squares in any direction
        moves.push( ...getLegalSingleMoves(
            board, position, Piece.Bede * colour, [
                // Elongated knight moves
                p => Piece.getFile(p) >= 3 ? p + 5 : p,p => Piece.getFile(p) <= 4 ? p - 5 : p,
                p => Piece.getFile(p) <= 4 ? p + 11 : p, p => Piece.getFile(p) >= 3 ? p - 11 : p,
                p => Piece.getFile(p) >= 1 ? p + 23 : p, p => Piece.getFile(p) <= 6 ? p - 23 : p,
                p => Piece.getFile(p) <= 6 ? p + 25 : p, p => Piece.getFile(p) >= 1 ? p - 25 : p,
                // Orthogonal Leaps
                p => Piece.getRank(p) <= 6 && Piece.getFile(p) <= 6 ? p + 9 : p, //up & right
                p => Piece.getRank(p) <= 6 && Piece.getFile(p) >= 1 ? p + 7 : p, //up & left
                p => Piece.getRank(p) >= 1 && Piece.getFile(p) <= 6 ? p - 7 : p, //down & right
                p => Piece.getRank(p) >= 1 && Piece.getFile(p) >= 1 ? p - 9 : p, //down & left
            ], mode
        ) );

        return moves
    }
}