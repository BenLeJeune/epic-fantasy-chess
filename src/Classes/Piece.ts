import Pawn from "../Pieces/FIDE/Pawn";
import Knight from "../Pieces/FIDE/Knight";
import Bishop from "../Pieces/FIDE/Bishop";
import Rook from "../Pieces/FIDE/Rook";
import Queen from "../Pieces/FIDE/Queen";
import King from "../Pieces/FIDE/King";
import GamePiece from "../Pieces/GamePiece";
import {FILES} from "../types";
import w_pawn from "../assets/Pieces/pawn_white.svg";
import b_pawn from "../assets/Pieces/pawn_black.svg";
import w_knight from "../assets/Pieces/knight_white.svg";
import b_knight from "../assets/Pieces/knight_black.svg";
import w_bishop from "../assets/Pieces/bishop_white.svg";
import b_bishop from "../assets/Pieces/bishop_black.svg";
import w_rook from "../assets/Pieces/rook_white.svg";
import b_rook from "../assets/Pieces/rook_black.svg";
import w_queen from "../assets/Pieces/queen_white.svg";
import b_queen from "../assets/Pieces/queen_black.svg";
import w_king from "../assets/Pieces/king_white.svg";
import b_king from "../assets/Pieces/king_black.svg";

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

    public static w_images = [ w_pawn, w_knight, w_bishop, w_queen, w_king ];
    public static b_images = [ b_pawn, b_knight, b_bishop, b_queen, b_king ];

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
    public static getSquareName = ( position : number ) => `${ FILES[Piece.getFile(position)] }-${ Piece.getRank(position) }`
    public static getStyle = ( position : number ) => {
        return {
            gridRow: `${ 8 - Piece.getRank(position) }/${9 - Piece.getRank(position)}`,
            gridColumn: `${ Piece.getFile(position) + 1 }/${Piece.getFile(position) + 2}`
        }
    }

    public static getPiece : ( piece : number ) => GamePiece | null = (piece ) => [
        null, new Pawn(), new Knight(), new Bishop(), new Rook(), new Queen(), new King()
    ][ Math.abs(piece) ]

    //public static getImage = ( piece : number ) => `/assets/pieces/${ Piece.longName( piece ).toLowerCase() }_${ piece > 0 ? "white" : "black" }.svg`;

    public static getImage = ( piece : number ) => {
        switch ( Math.abs(piece) ) {
            case 0:
                return "";
            case Piece.Pawn:
                return piece > 0 ? w_pawn : b_pawn;
            case Piece.Knight:
                return piece > 0 ? w_knight : b_knight;
            case Piece.Bishop:
                return piece > 0 ? w_bishop : b_bishop;
            case Piece.Rook:
                return piece > 0 ? w_rook : b_rook;
            case Piece.Queen:
                return piece > 0 ? w_queen : b_queen;
            case Piece.King:
                return piece > 0 ? w_king : b_king;
        }
    }

}