import Piece from "../Piece";
import {FILES, ROOK, WHITE} from "../../constants/consts";
import Square from "../../Classes/Square";
import {Colour} from "../../types";
import {isObstructed, isOpposingCapture, isRidingObstructed} from "../../helpers/BoardTools";
import Board from "../../Classes/Board";

export default class Rook extends Piece {

    value = 500;
    shortName = "r";
    longName = "rook";
    valueGrid = [];
    categories = [ ROOK ];

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "b" );
    }

    public isLegalMove(_square: Square, board : Board, capturing : boolean = false): boolean {
        //Checks
        if ( !super.isLegalMove(_square, board) ) {
            return false;
        }

        //If is unobstructed
        if ( !isObstructed( this.square, _square, board ) && _square !== this.square
            && ( this.square.getRank() === _square.getRank() || this.square.getFile() === _square.getFile() ) ) {
            if (capturing) return isOpposingCapture( _square, this );
            //Returns true if same rank OR same file and isn't an opposing capture
            return !isOpposingCapture( _square, this ) && _square.isEmpty();
        }

        return false
    }
}