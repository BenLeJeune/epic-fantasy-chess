import {Move, SpecialMove} from "../types";
import {generateFIDEBoard} from "../helpers/BoardGenerators";
import ActualMove from "./Move";
import Piece from "./Piece";
import Pawn from "../Pieces/FIDE/Pawn";

export default class Game {

    private readonly board : number[]

    private currentTurn : number; //1 for white, -1 for black

    private moves : ActualMove[]

    public UnMove = () => {

        //Let's roll back the most recent move!
        let move = this.moves.pop();
        this.moves = [ ...this.moves ]
        if ( move === undefined ) return;

        let colour = move.moving > 0 ? 1 : -1;

        //Let's replace any piece that was captured
        if ( move.special !== "EP" ) this.board[ move.to ] = move.captured;
        this.board[ move.from ] = move.moving;

        switch ( move.special ) {
            case "EP":
                this.board[ move.to ] = Piece.None;
                this.board[ move.to - 8 * colour ] = move.captured;
                break;
            case "PROMOTION":
                //We should be able to attach the piece we want to promote to
                break;
            case "CASTLE":
                //CASTLING RULES
                //We've already moved the king. Now, we want to move the rook.

                //If we were castling Queenside
                if ( move.from > move.to ) {
                    let rookSquare = move.to - 2;
                    this.board[rookSquare] = this.board[ move.to + 1 ];
                    this.board[ move.to + 1 ] = Piece.None;
                }
                //If we were castling Kingside
                if ( move.from < move.to ) {
                    let rookSquare = move.to + 1;
                    this.board[rookSquare] = this.board[ move.to - 1 ];
                    this.board[ move.to - 1 ] = Piece.None;
                }

                break;
            case undefined:
            default:
                break;
        }


        this.currentTurn = -this.currentTurn; //THE NEXT PLAYER'S TURN

    };

    public Move = ( from : number, to : number, special? : SpecialMove, additional: Partial<AdditionalOptions> = {}) => {
        //Let's add the move function
        //Keeping it simple for now, let's just make the move. Forcefully.

        //Let's see if there is anything special we need to do
        let colour = this.board[from] > 0 ? 1 : -1;
        let specify = ActualMove.NONE;
        let moving = this.board[from];
        let captured = this.board[to];

        if ( Math.abs( this.board[from] ) === Piece.Pawn && this.board[to] !== 0) {
            specify = ActualMove.FILE
        }

        //WE ALSO WANT TO HANDLE SPECIAL MOVES
        switch ( special ) {
            case "EP":
                captured = this.board[ to - 8 * colour ];
                this.board[ to - 8 * colour ] = Piece.None;
                break;
            case "PROMOTION":
                //We should have the piece attached
                if ( additional.hasOwnProperty("promotionTo") && additional.promotionTo !== undefined ) {
                    let { promotionTo } = additional;
                    //Now, we just replace the piece with the one we want to promote to!
                    this.board[ from ] = promotionTo;
                }
                break;
            case "CASTLE":
                //CASTLING RULES
                //We've already moved the king. Now, we want to move the rook.

                //If we're castling Queenside
                if ( from > to ) {
                    let rookSquare = to - 2;
                    this.board[ to + 1 ] = this.board[rookSquare];
                    this.board[rookSquare] = Piece.None;
                }
                //If we're castling Kingside
                if ( from < to ) {
                    let rookSquare = to + 1;
                    this.board[ to - 1 ] = this.board[rookSquare];
                    this.board[rookSquare] = Piece.None;
                }

                break;
            case undefined:
            default:
                break;
        }

        this.moves.push( new ActualMove( from, to, moving, captured, specify, special) );

        //Let's move the piece on To to From.
        this.board[to] = this.board[from];
        this.board[from] = Piece.None;

        this.currentTurn = -this.currentTurn;

    }

    constructor( _board : number[] = generateFIDEBoard(), _history : ActualMove[] = [] ) {
        this.board = _board;
        this.moves = _history;
        this.currentTurn = 1;
    }

    public getBoard = () => this.board;
    public getMoves = () => this.moves;
    public getCurrentTurn = () => this.currentTurn;

    public getLastMove = () => this.moves.length > 0 ? this.moves[ this.moves.length - 1 ] : undefined;

}

export interface AdditionalOptions {
    promotionTo : number
}