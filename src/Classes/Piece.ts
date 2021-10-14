import Pawn from "../Pieces/FIDE/Pawn";
import Knight from "../Pieces/FIDE/Knight";
import Bishop from "../Pieces/FIDE/Bishop";
import Rook from "../Pieces/FIDE/Rook";
import Queen from "../Pieces/FIDE/Queen";
import King from "../Pieces/FIDE/King";
import GamePiece from "../Pieces/GamePiece";
import {FILES} from "../types";

//IMPORTING PIECE IMAGES
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

//COLOURBOUND CLOBBERERS
import Waffle from "../Pieces/COLBOUND/Waffle";
import Bede from "../Pieces/COLBOUND/Bede";
import Warbishop from "../Pieces/COLBOUND/Warbishop";
import Cardinal from "../Pieces/COLBOUND/Cardinal";

import w_bede from "../assets/Pieces/bede_white.svg";
import b_bede from "../assets/Pieces/bede_black.svg";
import w_waffle from "../assets/Pieces/waffle_white.svg";
import b_waffle from "../assets/Pieces/waffle_black.svg";
import w_warbishop from "../assets/Pieces/warbishop_white.svg";
import b_warbishop from "../assets/Pieces/warbishop_black.svg";
import w_cardinal from "../assets/Pieces/cardinal_white.svg";
import b_cardinal from "../assets/Pieces/cardinal_black.svg";


export default class Piece {

    public static PIECES = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]

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

    ///
    /// COLOURBOUND CLOBBERERS VALUES
    ///
    public static Waffle = 7;
    public static Warbishop = 8;
    public static Bede = 9;
    public static Cardinal = 10;

    public static isWhite = ( piece : number ) => piece > 0;
    public static isBlack = ( piece : number ) => piece < 0;

    public static getFile = ( position : number ) => position % 8;
    public static getRank = ( position : number ) => ( position - ( position % 8 ) ) / 8;
    public static getSquareName = ( position : number ) => `${ FILES[Piece.getFile(position)] }${ Piece.getRank(position) + 1 }`
    public static getStyle = ( position : number ) => {
        return {
            gridRow: `${ 8 - Piece.getRank(position) }/${9 - Piece.getRank(position)}`,
            gridColumn: `${ Piece.getFile(position) + 1 }/${Piece.getFile(position) + 2}`
        }
    }

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
            case Piece.Waffle:
                return piece > 0 ? w_waffle : b_waffle;
            case Piece.Warbishop:
                return piece > 0 ? w_warbishop : b_warbishop;
            case Piece.Bede:
                return piece > 0 ? w_bede : b_bede;
            case Piece.Cardinal:
                return piece > 0 ? w_cardinal : b_cardinal;
        }
    }
    public static getPiece : ( piece : number ) => GamePiece | null = (piece ) => [
        null, new Pawn(), new Knight(), new Bishop(), new Rook(), new Queen(), new King(),
         new Waffle(), new Warbishop(), new Bede(), new Cardinal()
    ][ Math.abs(piece) ]

}