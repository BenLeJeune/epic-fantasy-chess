import {Colour} from "../../types";
import Piece from "../Piece";
import Square from "../../Classes/Square";
import {FILES, KNIGHT, WHITE} from "../../constants/consts";
import Board from "../../Classes/Board";
import {isOpposingCapture} from "../../helpers/BoardTools";

export default class Knight extends Piece {

    value = 300;
    shortName = "k";
    longName = "knight";
    valueGrid = [];
    categories = [ KNIGHT ];

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "p" );
    }

    isLegalMove(_square: Square, board: Board, capturing : boolean = false): boolean {
        //Checks
        if (!super.isLegalMove(_square, board)) {
            return false
        }

        //We go two in one direction, then one in another direction;
        //Say we go two horizontally, then one vertically
        if ( Math.abs( this.square.getRank() - _square.getRank() ) === 2 ) {
            if ( Math.abs( FILES.indexOf(this.square.getFile()) - FILES.indexOf(_square.getFile()) ) === 1 ) {
                if (capturing) return isOpposingCapture( _square, this );
                return _square.isEmpty();
            }
        }
        //Or, we can go two vertically and one horizontally
        else if ( Math.abs( this.square.getRank() - _square.getRank() ) === 1 ) {
            if ( Math.abs( FILES.indexOf(this.square.getFile()) - FILES.indexOf(_square.getFile()) ) === 2 ) {
                if (capturing) return isOpposingCapture( _square, this );
                return _square.isEmpty();
            }
        }

        return false;
    }

}