import BoardState from "../Classes/BoardState";
import Square from "../Classes/Square";
import {Colour, PieceCategory} from "../types";

export default abstract class Piece {

    //protected abstract values
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

    public move ( _square : Square ) : BoardState {
        //placeholder, will be extended in children
        return new BoardState();
    }

    public getLegalMoves() : Square[] {
        //placeholder, will be extended in children
        return [ new Square( "a", 1, null ) ]
    }

    public isLegalMove( _square : Square ) : boolean {
        //placeholder, will be extended in children
        return true;
    }

    public isLegalCapture( _square : Square ) : boolean {
        //placeholder, will be extended in children
        return true;
    }

    protected constructor( _square : Square, _colour : Colour, _shortName : string ) {
        this.id = `${ _shortName }_${ _square.getSquareName() }`;
        this.hasMoved = false;
        this.square = _square;
        this.colour = _colour;
    }

    //Accessor Methods
    public getShortName : () => string = () => this.shortName;
    public getLongName : () => string = () => this.longName;
    public getColour : () => Colour = () => this.colour;
    public getHasMoved : () => boolean = () => this.hasMoved;
    public getId : () => string = () => this.id;

    public setColour : ( c:Colour ) => void = ( _colour : Colour ) => { this.colour = _colour };

}