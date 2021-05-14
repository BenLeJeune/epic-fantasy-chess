import {SquareFile} from "../types";
import Piece from "../Pieces/Piece";
import {FILES} from "../constants/consts";

export default class Square {

    private readonly file : SquareFile
    private readonly rank : number
    private piece : Piece | null

    public getSquareName() : string {
        return this.file + this.rank
    }

    public getSquareNumber() : number {
        return ( 8 * ( this.rank - 1 ) ) + FILES.indexOf( this.file ) + 1
    }

    public isEmpty() : boolean {
        return this.piece === null
    }


    constructor(  _file : SquareFile, _rank : number, _piece : Piece | null = null ) {
        this.rank = _rank;
        this.file = _file;
        this.piece = _piece;
    }

    //Accessor Methods
    public getRank : () => number = () => this.rank;
    public getFile : () => SquareFile = () => this.file;
    public getFileN : () => number = () => FILES.indexOf( this.file );
    public getPiece : () => Piece | null = () => this.piece;

    public setPiece : ( _piece : Piece ) => void = ( _piece : Piece ) => { this.piece = _piece };
    public removePiece : () => void = () => { this.piece = null };

}