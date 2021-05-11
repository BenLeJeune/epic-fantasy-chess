import {Colour} from "../../types";
import Piece from "../Piece";
import Square from "../../Classes/Square";
import {KNIGHT, WHITE} from "../../constants/consts";

export default class Knight extends Piece {

    value = 3;
    shortName = "k";
    longName = "knight";
    valueGrid = [];
    categories = [ KNIGHT ];

    constructor( _square : Square, _colour : Colour = WHITE ) {
        super( _square, _colour, "p" );
    }



}