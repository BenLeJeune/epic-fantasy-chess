import GamePiece from "../GamePiece";
import {legalMove, Move, tag} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import {rookGrid} from "../ValueGrids"
import Bishop from "../FIDE/Bishop";

export default class Bede extends GamePiece {

    //eval
    public materialValue = 5;
    public engineValue = 530;
    public valueGrid = rookGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & displaying
    public shortName = Bede.shortName;
    public longName = Bede.longName;
    public static shortName = "BD";
    public static longName = "Bede";

    public movesDescription = "Moves as a bishop, or can leap 2 squares vertically or horizontally.";
    public specialMoves = [
        "If neither pieces have moved, and this doesn't cause the king to move through check, can \"castle\" with the king.",
        "As this piece is colourbound, the king can move up to three squares to keep it on its colour."
    ]
    public notes = "";
    public categories = [ "Minor", "Rook", "Crusader" ] as tag[];

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[] 
    = ( position, board, mode, colour = 1 ) => {
        
        let moves = [] as legalMove[];

        //Give it all the moves a bishop would have
        moves.push( ...new Bishop().getLegalMoves( position, board, mode, colour ) );

        //Also give the vertical leap
        moves.push( ...getLegalSingleMoves(
            board, position, Piece.Bede * colour, [
                p => Piece.getRank(p) >= 2 ? p - 16 : p, p => Piece.getRank(p) <= 5 ? p + 16 : p,
                p => Piece.getFile(p) >= 2 ? p - 2 : p, p => Piece.getFile(p) <= 5 ? p + 2 : p
            ], mode
        ) );

        return moves
   }
}