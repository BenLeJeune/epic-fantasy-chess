import Piece from "../Piece";
import {ROOK, WHITE} from "../../constants/consts";
import Square from "../../Classes/Square";
import {Colour} from "../../types";

export default class Rook extends Piece {

    value = 5.5; //According to AlphaZero
    shortName = "r";
    longName = "rook";
    valueGrid = [];
    categories = [ ROOK ];

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "b" );
    }
}