import Square from "./Square";
import {SquareFile} from "../types";
import { FILES } from "../constants/consts";
import Piece from "../Pieces/Piece";

export default class BoardState {

    private readonly squares : Square[][] //Square[file][rank]

    public getSquare( file : SquareFile, rank : number ) : Square {
        const _rank = rank - 1;
        const _file = FILES.indexOf(file);
        return this.squares[_file][_rank]
    }

    //File from "a" to "h" or 1 to 8, rank from 1 to 8
    public updateSquare( file : SquareFile | number, rank : number, piece : Piece | null ) : BoardState {
        let newSquare;
        if ( typeof file === "number" ) {
            newSquare = new Square( FILES[file - 1], rank, piece );
            this.squares[rank - 1][file - 1] = newSquare;
        }
        else {
            newSquare = new Square( file, rank, piece );
            this.squares[rank - 1][FILES.indexOf(file)] = newSquare;
        }
        return this;
    }

    constructor() {
        //Fill board with empty squares
        this.squares = [ [], [], [], [], [], [], [], [] ] //Empty
        for ( let rank = 0; rank <= 7; rank++ ) {
            for ( let file = 0; file <= 7; file++ ) {
                this.squares[ file ][ rank ] = new Square( FILES[file], rank + 1, null )
            }
        }
    }

    //Accessor Methods
    public getSquares : () => Square[][] = () => this.squares;

}