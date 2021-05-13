import Piece from "../Piece";
import {BISHOP, FILES, WHITE} from "../../constants/consts";
import Square from "../../Classes/Square";
import {Colour} from "../../types";
import Board from "../../Classes/Board";
import {isObstructed} from "../../helpers/BoardTools";

export default class Bishop extends Piece {

    value = 3.3; //According to AlphaZero
    shortName = "b";
    longName = "bishop";
    valueGrid = [];
    categories = [ BISHOP ];

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "b" );
    }

    public isLegalMove(_square: Square, board: Board): boolean {
        //Checks
        if (!super.isLegalMove(_square, board)) {
            return false;
        }

        let rankDifference = this.square.getRank() - _square.getRank();
        let fileDifference = FILES.indexOf(this.square.getFile()) - FILES.indexOf(_square.getFile());

        if ( Math.abs(rankDifference) === Math.abs(fileDifference) ) {
            return !isObstructed( this.square, _square, board ) && _square.isEmpty()
        }

        return false

    }

}
