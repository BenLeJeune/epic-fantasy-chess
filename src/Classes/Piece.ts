import Pawn from "../Pieces/FIDE/Pawn";
import Knight from "../Pieces/FIDE/Knight";
import Bishop from "../Pieces/FIDE/Bishop";
import Rook from "../Pieces/FIDE/Rook";
import Queen from "../Pieces/FIDE/Queen";
import King from "../Pieces/FIDE/King";
import GamePiece from "../Pieces/GamePiece";
import {FILES} from "../types";

export default class Piece {

    ///
    /// PIECE NUMBER VALUES - negative for black!
    ///
    public static None = 0;
    public static Pawn = 1;
    public static Knight = 2;
    public static Bishop = 3;
    public static Rook = 4;
    public static Queen = 5;
    public static King = 6;

    public static isWhite = ( piece : number ) => piece > 0;
    public static isBlack = ( piece : number ) => piece < 0;

    public static getLegalMoves = ( piece : number, position : number, mode : "all" | "moves" | "captures" ) => {

        //We can put some nice move logic in here
        //This will only return quasi-legal moves (i.e ignoring checks)
    }

    public static longName = ( piece : number ) => [
        "None", "Pawn", "Knight", "Bishop", "Rook", "Queen", "King"
    ][ Math.abs( piece ) ]

    public static shortName = ( piece : number ) => [
        "", "p", "k", "b", "r", "q", "k"
    ][ Math.abs( piece ) ]

    public static getFile = ( position : number ) => position % 8;
    public static getRank = ( position : number ) => ( position - ( position % 8 ) ) / 8;
    public static getSquareName = ( position : number ) => `${ FILES[Piece.getFile(position)] }${ Piece.getRank(position) + 1 }`
    public static getStyle = ( position : number ) => {
        return {
            gridRow: `${ 8 - Piece.getRank(position) }/${9 - Piece.getRank(position)}`,
            gridColumn: `${ Piece.getFile(position) + 1 }/${Piece.getFile(position) + 2}`
        }
    }

    public static getImage = ( piece : number ) => `/assets/pieces/${ Piece.longName( piece ).toLowerCase() }_${ piece > 0 ? "white" : "black" }.svg`

    public static getPiece : ( piece : number ) => GamePiece | null = (piece ) => [
        null, new Pawn(), new Knight(), new Bishop(), new Rook(), new Queen(), new King()
    ][ Math.abs(piece) ]

}