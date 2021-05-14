import Piece from "../Piece";
import {FILES, ROOK, WHITE} from "../../constants/consts";
import Square from "../../Classes/Square";
import {Colour} from "../../types";
import {isObstructed, isRidingObstructed} from "../../helpers/BoardTools";
import Board from "../../Classes/Board";

export default class Rook extends Piece {

    value = 5.5; //According to AlphaZero
    shortName = "r";
    longName = "rook";
    valueGrid = [];
    categories = [ ROOK ];

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "b" );
    }

    public isLegalMove(_square: Square, board : Board): boolean {
        //Checks
        if ( !super.isLegalMove(_square, board) ) {
            return false;
        }

        //If is unobstructed
        if ( !isObstructed( this.square, _square, board ) ) {
            return this.square.getRank() === _square.getRank() ||
                this.square.getFile() === _square.getFile();
        }

        return false
    }
}