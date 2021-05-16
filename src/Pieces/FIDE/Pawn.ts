import Piece from "../Piece";
import Square from "../../Classes/Square";
import {BLACK, WHITE, PAWN} from "../../constants/consts";
import { Colour, PieceCategory } from "../../types";
import Board from "../../Classes/Board";
import {isObstructed, isOpposingCapture} from "../../helpers/BoardTools";

export default class Pawn extends Piece {

    value = 100;
    shortName = "p";
    longName = "pawn";
    valueGrid = [];
    categories = [ PAWN ];

    public isLegalMove( _square : Square, board : Board, capturing : boolean = false ) : boolean {

        //We don't want any capturing logic going on in here
        if ( capturing ) return false;

        //This returns false if king is checkmated
        if ( !super.isLegalMove( _square, board ) )  {
            return false;
        }

        //Can move one square upwards, remains on same file
        //If the file is the same
        if ( this.square.getFile() === _square.getFile() ) {
            //If the rank is one greater (for white)

            let distance = this.colour === WHITE ? 1 : -1;

            if (
                !this.hasMoved &&
                this.id.split("_")[1] === this.square.getSquareName() &&
                this.square.getRank() + ( distance * 2 ) === _square.getRank() &&
                !isObstructed( this.square, _square, board )
            ) {
                //We can move twice as far if we haven't yet moved and we're starting on our original square.
                return _square.isEmpty()
            }

            if ( this.square.getRank() + distance === _square.getRank() ) {
                //The move is valid if the square is empty
                return _square.isEmpty();
            }
            else {
                return false
            }
        }
        else {
            return false;
        }
    }

    public isLegalCapture( _square : Square, board : Board ) : boolean {
        //We want to know if this is a legal capture

        //Pawns can capture 1 up to the left or right
        let direction = this.colour === WHITE ? 1 : -1;

        if ( _square.getRank() === this.square.getRank() + direction ) {
            //If it's on the next rank
            if ( Math.abs( _square.getFileN() - this.square.getFileN() ) === 1 ) {
                //If it's one file either side
                return isOpposingCapture( _square, this );
            }
        }

        return false;
    }

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "p" );
    }

}