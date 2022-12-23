import GamePiece from "../GamePiece";
import {legalMove, Move, tag} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import {bishopGrid} from "../ValueGrids"
import ActualMove from "../../Classes/Move";
import {differentColours, sameColour} from "../../helpers/DifferentColours";

export default class Jester extends GamePiece {

    //eval
    public materialValue = 3;
    public engineValue = 350;
    public valueGrid = bishopGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & displaying
    public shortName = Jester.shortName;
    public longName = Jester.longName;
    public static shortName = "J";
    public static longName = "Jester";

    public movesDescription = "Moves as the piece your opponent last moved.";
    public specialMoves = []
    public notes = "Ignores card-based moves. Cannot move if your opponent hasn't moved a piece yet.";
    public categories = [ "Minor", "Unique", "Omega" ] as tag[];

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number, history: ActualMove[]) => legalMove[]
        = ( position, board, mode, colour = 1, history ) => {

        let moves = [] as legalMove[];


        // We want to find the piece our opponent last moved. THIS CAN'T BE A JESTER!
        let pieceMoves = [...history].reverse().filter( m => differentColours(m.moving, colour)).filter( m => !m.additional.hasOwnProperty("isCardMove") && Math.abs(m.moving) !== Piece.Jester );
        if (pieceMoves.length >= 1) {
            let m = pieceMoves[0], piece = Piece.getPiece(m.moving);
            if (piece) {
                moves.push(...piece.getLegalMoves(position, board, mode, colour, history));
            }
        }

        return moves
    }
}