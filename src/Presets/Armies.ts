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
    Piece.King,
    Piece.Bishop,
    Piece.Knight,
    Piece.Rook
], "FIDE Army");

export const CRUSADERSARMY = new Army([
    Piece.Bede,
    Piece.Waffle,
    Piece.Warbishop,
    Piece.Cardinal,
    Piece.King,
    Piece.Warbishop,
    Piece.Waffle,
    Piece.Bede
], "Colourbound Crusaders")

export const DEV_ARMY = new Army([
    Piece.Wizard,
    Piece.Jester,
    Piece.Champion,
    Piece.Queen,
    Piece.King,
    Piece.Champion,
    Piece.Jester,
    Piece.Wizard
], "dev-army")