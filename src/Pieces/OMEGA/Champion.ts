import GamePiece from "../GamePiece";
import {legalMove, Move, tag} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import {rookGrid} from "../ValueGrids"
import Bishop from "../FIDE/Bishop";

export default class Champion extends GamePiece {

    //eval
    public materialValue = 4;
    public engineValue = 400;
    public valueGrid = rookGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & displaying
    public shortName = Champion.shortName;
    public longName = Champion.longName;
    public static shortName = "CH";
    public static longName = "Champion";

    public movesDescription = "Leaps exactly 2 squares in any direction, or makes 1 move rookwise.";
    public specialMoves = []
    public notes = "";
    public categories = [ "Minor", "Unique", "Omega" ] as tag[];

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[]
        = ( position, board, mode, colour = 1 ) => {

        let moves = [] as legalMove[];


        moves.push( ...getLegalSingleMoves(
            board, position, Piece.Bede * colour, [
                // Orthogonal Leaps
                p => Piece.getRank(p) >= 2 ? p - 16 : p, // Down
                p => Piece.getRank(p) <= 5 ? p + 16 : p, // Up
                p => Piece.getFile(p) >= 2 ? p - 2 : p, // Left
                p => Piece.getFile(p) <= 5 ? p + 2 : p, // Right
                p => Piece.getRank(p) <= 5 && Piece.getFile(p) <= 5 ? p + 18 : p, //up & right
                p => Piece.getRank(p) <= 5 && Piece.getFile(p) >= 2 ? p + 14 : p, //up & left
                p => Piece.getRank(p) >= 2 && Piece.getFile(p) <= 5 ? p - 14 : p, //down & right
                p => Piece.getRank(p) >= 2 && Piece.getFile(p) >= 2 ? p - 18 : p, //down & left
                // Single orthogonal steps
                p => Piece.getRank(p) >= 1 ? p - 8 : p, p => Piece.getRank(p) <= 6 ? p + 8 : p,
                p => Piece.getFile(p) >= 1 ? p - 1 : p, p => Piece.getFile(p) <= 6 ? p + 1 : p
            ], mode
        ) );

        return moves
    }
}