import Piece from "../Piece";
import {QUEEN, WHITE} from "../../constants/consts";
import Square from "../../Classes/Square";
import {Colour} from "../../types";

export default class Queen extends Piece {

    value = 9.5; //According to AlphaZero
    shortName = "q";
    longName = "queen";
    valueGrid = [];
    categories = [ QUEEN ];

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "b" );
    }


}