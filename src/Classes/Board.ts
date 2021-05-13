import Piece from "../Pieces/Piece";
import { SquareFile } from "../types";
import BoardState from "./BoardState";
import Square from "./Square";

export default class Board {

    private state : BoardState
    private readonly history : BoardState[]

    public getSquares() : Square[][] { //Returns all squares
        return this.state.getSquares();
    }

    public getSquaresLinear() : Square[] { //Returns squares in a single array
        return this.state.getSquares().reduce(( prev, next ) => [ ...prev, ...next ]);
    }

    public getSquare( file : SquareFile, rank : number ) : Square {
        return this.state.getSquare( file, rank );
    }

    public getPieces() : Piece[] {
        const squaresList = this.getSquaresLinear();
        const filledSquares = squaresList.filter( square => !square.isEmpty() );
        return filledSquares.map( square => square.getPiece() as Piece )
    }

    public getPiece( pieceId : string ) : Piece | null {
        const squaresList = this.getSquaresLinear();
        const filledSquares = squaresList.filter( square => !square.isEmpty() );
        const matches = filledSquares.filter( sq => sq.getPiece()?.getId() === pieceId );
        return matches.length > 0 ? matches[0].getPiece() as Piece : null
    }

    public updateBoard( newBoard : BoardState | (( currentState : BoardState ) => BoardState) ) : BoardState {
        this.history.push(this.state);
        if ( typeof newBoard === "function" ) {
            //A function was passed
            this.state = newBoard( this.state );
        }
        else {
            //A board was passed directly
            this.state = newBoard;
        }
        return this.state;
    }

    constructor() {
        this.state = new BoardState()
        this.history = [];
    }

    //Accessor Methods
    public getHistory : () => BoardState[] = () => this.history;
    public getBoardState: () => BoardState = () => this.state;

}