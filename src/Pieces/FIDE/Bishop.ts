import Piece from "../Piece";
import {BISHOP, WHITE} from "../../constants/consts";
import Square from "../../Classes/Square";
import {Colour} from "../../types";

export default class Bishop extends Piece {

    value = 3.3; //According to AlphaZero
    shortName = "b";
    longName = "bishop";
    valueGrid = [];
    categories = [ BISHOP ];

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "b" );
    }


}
