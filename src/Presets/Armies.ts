import Piece from "../Classes/Piece";
import GamePiece from "../Pieces/GamePiece";

export class Army {

    pieces: number[]

    name: string

    constructor( _pieces: number[], _name: string ) {
        this.pieces = _pieces;
        this.name = _name;
    }

}

export const FIDEARMY = new Army([
    Piece.Rook,
    Piece.Knight,
    Piece.Bishop,
    Piece.Queen,
    Piece.Bishop,
    Piece.Knight,
    Piece.Rook
], "FIDE Army");