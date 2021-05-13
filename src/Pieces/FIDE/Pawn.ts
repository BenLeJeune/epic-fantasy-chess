import Piece from "../Piece";
import Square from "../../Classes/Square";
import {BLACK, WHITE, PAWN} from "../../constants/consts";
import { Colour, PieceCategory } from "../../types";

export default class Pawn extends Piece {

    value = 1;
    shortName = "p";
    longName = "pawn";
    valueGrid = [];
    categories = [ PAWN ];
    //
    // public isLegalMove( _square : Square ) : boolean {
    //     //This returns false if king is checkmated
    //     if ( !super.isLegalMove( _square ) )  {
    //         return false;
    //     }
    //
    //     //Can move one square upwards, remains on same file
    //     //If the file is the same
    //     if ( this.square.getFile() === _square.getFile() ) {
    //         //If the rank is one greater (for white)
    //         if ( this.colour === WHITE && this.square.getRank() + 1 === _square.getRank() ) {
    //             //The move is valid if the square is empty
    //             return _square.isEmpty();
    //
    //         }
    //         else if ( this.colour === BLACK && this.square.getRank() - 1 === _square.getRank() ) {
    //             //Move is valid if the square is empty
    //             return _square.isEmpty();
    //         }
    //         else {
    //             return false
    //         }
    //     }
    //     else {
    //         return false;
    //     }
    // }

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "p" );
    }

}