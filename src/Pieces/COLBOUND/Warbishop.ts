import GamePiece from "../GamePiece";
import {legalMove, Move, tag} from "../../types";
import {getLegalRiderMoves, getLegalSingleMoves} from "../../helpers/RiderMoves";
import Piece from "../../Classes/Piece";
import {bishopGrid} from "../ValueGrids";
import Waffle from "./Waffle";

export default class Warbishop extends GamePiece {

    //eval
    public materialValue = 4;
    public engineValue = 400;
    public valueGrid = bishopGrid;
    public evaluate = ( p : number ) => this.engineValue;

    //naming & display
    public shortName = Warbishop.shortName;
    public longName = Warbishop.longName;
    public static shortName = "WB";
    public static longName = "Warbishop";

    public movesDescription = "Can leap two squares vertically or horizontally, or one or two squares diagonally.";
    public specialMoves = []
    public notes = "Is colour-bound.";
    public categories = [ "Minor", "Bishop", "Colour-bound", "Crusader" ] as tag[];

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[] = ( position, board, mode, colour = 1 ) => {
        //Let's use this as a test for the legal rider moves

        let moves = [] as legalMove[];
        moves.push( ...getLegalSingleMoves(
            board, position, Piece.Warbishop * colour, [
                //Single-move-diagonal
                p => Piece.getRank(p) <= 6 && Piece.getFile(p) <= 6 ? p + 9 : p, //up & right
                p => Piece.getRank(p) <= 6 && Piece.getFile(p) >= 1 ? p + 7 : p, //up & left
                p => Piece.getRank(p) >= 1 && Piece.getFile(p) <= 6 ? p - 7 : p, //down & right
                p => Piece.getRank(p) >= 1 && Piece.getFile(p) >= 1 ? p - 9 : p, //down & left
                //Double-move diagonal
                p => Piece.getRank(p) <= 5 && Piece.getFile(p) <= 5 ? p + 18 : p, //up & right
                p => Piece.getRank(p) <= 5 && Piece.getFile(p) >= 2 ? p + 14 : p, //up & left
                p => Piece.getRank(p) >= 2 && Piece.getFile(p) <= 5 ? p - 14 : p, //down & right
                p => Piece.getRank(p) >= 2 && Piece.getFile(p) >= 2 ? p - 18 : p, //down & left
                //Leaps from the bede
                p => Piece.getRank(p) >= 2 ? p - 16 : p, p => Piece.getRank(p) <= 5 ? p + 16 : p,
                p => Piece.getFile(p) >= 2 ? p - 2 : p, p => Piece.getFile(p) <= 5 ? p + 2 : p

            ], mode
        ) )

        return moves;

    }

}