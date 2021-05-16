import Piece from "../Piece";
import {QUEEN, WHITE} from "../../constants/consts";
import Square from "../../Classes/Square";
import {Colour} from "../../types";
import Board from "../../Classes/Board";
import {isObstructed, isOpposingCapture} from "../../helpers/BoardTools";

export default class Queen extends Piece {

    value = 900; //950 according to AlphaZero
    shortName = "q";
    longName = "queen";
    valueGrid = [];
    categories = [ QUEEN ];

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "b" );
    }

    isLegalMove(_square: Square, board: Board, capturing : boolean = false): boolean {
        //Checks
        if (!super.isLegalMove(_square, board)) {
            return false
        }

        if ( !isObstructed( this.square, _square, board ) ) {
            if ( capturing ) return isOpposingCapture( _square, this );
            return _square.isEmpty()
        }

        return false;
    }


}