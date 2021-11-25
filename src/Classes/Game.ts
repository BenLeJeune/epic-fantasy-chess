import {Move, SpecialMove} from "../types";
import {generateFIDEBoard} from "../helpers/BoardGenerators";
import ActualMove from "./Move";
import Piece from "./Piece";
import Pawn from "../Pieces/FIDE/Pawn";
import Rook from "../Pieces/FIDE/Rook";

export default class Game {

    private readonly board : number[]

    private currentTurn : number; //1 for white, -1 for black

    private moves : ActualMove[]

    private pieceIndexes : number[]; //Indexes where there are pieces

    public UnMove = () => {

        //Let's roll back the most recent move!
        let move = this.moves.pop();
        this.moves = [ ...this.moves ]
        if ( move === undefined ) return;

        let colour = move.moving > 0 ? 1 : -1;

        //Let's replace any piece that was captured
        if ( move.special !== "EP" ) {
            this.board[move.to] = move.captured;
            //Update piece indexes
            if ( move.captured !== Piece.None ) this.pieceIndexes.push( move.to )
        }
        this.board[ move.from ] = move.moving;
        //Update piece indexes
        this.pieceIndexes[ this.pieceIndexes.indexOf( move.to ) ] = move.from;

        switch ( move.special ) {
            case "EP":
                this.board[ move.to ] = Piece.None;
                this.board[ move.to - 8 * colour ] = move.captured;
                this.pieceIndexes.push( move.to - 8 * colour )
                break;
            case "PROMOTION":
                //We should be able to attach the piece we want to promote to
                break;
            case "CASTLE":
                //CASTLING RULES
                //We've already moved the king. Now, we want to move the rook.

                //If we were castling Queenside
                if ( move.from > move.to ) {
                    let rookDistance = 0;
                    if ( Math.abs(this.board[move.to + 1]) === Piece.Rook) {
                        //CASTLING WITH A SIMPLE ROOK
                        rookDistance = 2; //Rook is 2 after where the king moves to
                    }
                    else if ( Math.abs(this.board[move.to + 1]) === Piece.Bede) {
                        rookDistance = 1; //Bede is only 1 after where the king moves to
                    }
                    let rookSquare = move.to - rookDistance;
                    this.board[rookSquare] = this.board[ move.to + 1 ];
                    this.board[ move.to + 1 ] = Piece.None;
                    //Update pieceIndexes
                    this.pieceIndexes[ this.pieceIndexes.indexOf( move.to + 1 ) ] = rookSquare;
                }
                //If we were castling Kingside
                if ( move.from < move.to ) {
                    let rookSquare = move.to + 1;
                    this.board[rookSquare] = this.board[ move.to - 1 ];
                    this.board[ move.to - 1 ] = Piece.None;
                    this.pieceIndexes[ this.pieceIndexes.indexOf( move.to - 1 ) ] = rookSquare;
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

        if (captured !== Piece.None) {
            this.pieceIndexes.splice(this.pieceIndexes.indexOf(to), 1)
        }

        //WE ALSO WANT TO HANDLE SPECIAL MOVES
        switch ( special ) {
            case "EP":
                captured = this.board[ to - 8 * colour ];
                this.board[ to - 8 * colour ] = Piece.None;
                //Remove from piece indexes
                this.pieceIndexes.splice( this.pieceIndexes.indexOf( to - 8 * colour ), 1);
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
                    let rookSquare = to;
                    if ( Math.abs(this.board[ to - 2 ]) === Piece.Rook && this.board[ to - 1 ] === Piece.None ) {
                        //CASTLING WITH A SIMPLE ROOK
                        rookSquare -= 2; //Rook is 2 after where the king moves to
                    }
                    else if ( Math.abs(this.board[to - 1]) === Piece.Bede) {
                        rookSquare -= 1; //Bede is only 1 after where the king moves to
                    }
                    this.board[ to + 1 ] = this.board[rookSquare];
                    this.board[rookSquare] = Piece.None;
                    //Update piece indexes
                    this.pieceIndexes[ this.pieceIndexes.indexOf( rookSquare ) ] = to + 1
                }
                //If we're castling Kingside
                if ( from < to ) {
                    let rookSquare = to + 1;
                    this.board[ to - 1 ] = this.board[rookSquare];
                    this.board[rookSquare] = Piece.None;
                    //Update piece indexes
                    this.pieceIndexes[ this.pieceIndexes.indexOf( rookSquare ) ] = to - 1
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

        //Updater piece indexes
        this.pieceIndexes[ this.pieceIndexes.indexOf( from ) ] = to

        this.currentTurn = -this.currentTurn;

    }

    constructor( _board : number[] = generateFIDEBoard(), _history : ActualMove[] = [] ) {
        this.board = [..._board]
        this.moves = _history;
        this.currentTurn = 1;

        let _pieceIndexes = [] as number[];
        [ ..._board ].forEach((piece, i) => {
            if (piece !== Piece.None) _pieceIndexes.push(i);
        })
        this.pieceIndexes = _pieceIndexes;

        // FOR DEVELOPMENT PURPOSES
        if (global.window) ( global.window as any ).updateBoard = ( update:(board:number[])=>number[] ) => update(this.board).map((p, i) => this.board[i] = p);

    }

    public getBoard = () => this.board;
    public getMoves = () => this.moves;
    public getCurrentTurn = () => this.currentTurn;
    public getPieceIndexes = () => this.pieceIndexes;

    public getLastMove = () => this.moves.length > 0 ? this.moves[ this.moves.length - 1 ] : undefined;

    ///
    /// FOR PLAYING CARDS
    /// We want to be able to directly access the game board, so we'll do this
    ///

    public updateGameBoard : ( callback : ( board: number[] ) => void ) => void = ( callback : (board:number[]) => void ) => callback( this.board );

}

export interface AdditionalOptions {
    promotionTo : number
}