import Square from "../Classes/Square";
import {Colour, PieceCategory} from "../types";
import Board from "../Classes/Board";

export default abstract class Piece {

    //protected abstract values, set explicitly in children
    protected abstract value : number;
    protected abstract shortName : string;
    protected abstract longName : string;
    protected abstract categories : PieceCategory[];
    protected abstract valueGrid : Square[];

    protected square : Square;
    protected hasMoved : boolean;
    protected id : string;
    protected colour : Colour;

    public getValue( _square : Square ) : number {
        //Returns a piece's value, adjusted by the value grid.
        return this.value;
    }

    public hasCategory( category : PieceCategory ) : boolean {
        return this.categories.indexOf( category ) !== -1;
    }

    public move( _square : Square, board : Board ) : void {
        //If the move is a legal move
        if ( this.isLegalMove( _square, board ) ) {
            //Remove this piece from the square it's currently on
            this.square.removePiece();
            //Add it to the square we're moving it to
            _square.setPiece(this);
            this.square = _square;
            this.hasMoved = true;
        }
        //Captures are handled in the capture() function
    }

    public capture( _square : Square, board : Board, cb : ( p : Piece ) => void ) {
        if ( this.isLegalCapture( _square, board ) && !_square.isEmpty() ) {
            this.hasMoved = true;
            //Remove this piece from it's current square
            this.square.removePiece();
            //Remove the piece from the target square, trigger the callback
            cb( _square.getPiece() as Piece );
            _square.removePiece();
            //Move this piece to the new square
            _square.setPiece(this)
            this.square = _square;
        }
    }

    public getLegalMoves( board : Board ) : Square[] {
        let squares = board.getSquaresLinear();
        return squares.filter(sq => this.isLegalMove(sq, board) || this.isLegalCapture(sq, board))
    }

    public isLegalMove( _square : Square, board : Board, capturing : boolean = false ) : boolean {
        //placeholder, will be extended in children
        return true;
    }

    public isLegalCapture( _square : Square, board : Board ) : boolean {
        //placeholder, will be extended in children
        return this.isLegalMove( _square, board, true );
    }

    protected constructor( _square : Square, _colour : Colour, _shortName : string ) {
        this.id = `${ _shortName }_${ _square.getSquareName() }`;
        this.hasMoved = false;
        this.square = _square;
        this.colour = _colour;

        //Whenever you create a piece on a square, we will update that square.
        if ( this.square.isEmpty() ) {
            //If the square is empty, we will update it to include this square.
            this.square.setPiece( this );
        } else {
            console.error("ERR: Attempted to create piece on non-empty square");
        }
    }

    public getImg() : string {
        return `/Assets/Pieces/${ this.longName }_${ this.colour }.svg`;
    }

    //Accessor Methods
    public getShortName : () => string = () => this.shortName;
    public getLongName : () => string = () => this.longName;
    public getColour : () => Colour = () => this.colour;
    public getHasMoved : () => boolean = () => this.hasMoved;
    public getId : () => string = () => this.id;
    public getSquare : () => Square = () => this.square;
    public getMaterialValue : () => number = () => this.value;

    public setColour : ( c:Colour ) => void = ( _colour : Colour ) => { this.colour = _colour };

}