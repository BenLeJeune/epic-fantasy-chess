import {Move} from "../types";
import {generateFIDEBoard} from "../helpers/BoardGenerators";
import ActualMove from "./Move";
import Piece from "./Piece";
import Pawn from "../Pieces/FIDE/Pawn";

export default class Game {

    private readonly board : number[]

    private currentTurn : number;

    private moves : ActualMove[]

    public UnMove = () => {

        //Let's roll back the most recent move!
        let move = this.moves.pop();
        this.moves = [ ...this.moves ]
        if ( move === undefined ) return;

        //Let's replace any piece that was captured
        this.board[ move.to ] = move.captured;
        this.board[ move.from ] = move.moving;

    };

    public Move = ( from : number, to : number ) => {
        //Let's add the move function
        //Keeping it simple for now, let's just make the move. Forcefully.

        //Let's see if there is anything special we need to do
        let specify = ActualMove.NONE;

        if ( Math.abs( this.board[from] ) === Piece.Pawn && this.board[to] !== 0) {
            specify = ActualMove.FILE
        }

        this.moves.push( new ActualMove( from, to, this.board[from], this.board[to], specify) );

        //Let's move the piece on To to From.
        this.board[to] = this.board[from];
        this.board[from] = 0;

    }

    constructor() {
        this.board = generateFIDEBoard();
        this.moves = [] as ActualMove[];
        this.currentTurn = 1;
    }

    public getBoard = () => this.board;
    public getMoves = () => this.moves;
    public getCurrentTurn = () => this.currentTurn;

}