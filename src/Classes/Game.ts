import {Move} from "../types";
import {generateFIDEBoard} from "../helpers/BoardGenerators";
import ActualMove from "./Move";
import Piece from "./Piece";
import Pawn from "../Pieces/FIDE/Pawn";

export default class Game {

    private readonly board : number[]

    private currentTurn : number;

    private moves : ActualMove[]

    public Move = ( from : number, to : number ) => {
        //Let's add the move function
        //Keeping it simple for now, let's just make the move. Forcefully.

        //Let's see if there is anything special we need to do
        let specify = ActualMove.NONE;

        if ( Math.abs( this.board[from] ) === Piece.Pawn && this.board[to] !== 0) {
            specify = ActualMove.FILE
        }

        this.moves = [ ...this.moves, new ActualMove( from, to, this.board[from], this.board[to], specify  ) ]

        //Let's move the piece on To to From.
        this.board[to] = this.board[from];
        this.board[from] = 0;

    }

    public UnMove = () => {};

    constructor() {
        this.board = generateFIDEBoard();
        this.moves = [] as ActualMove[];
        this.currentTurn = 1;
    }

    public getBoard = () => this.board;
    public getMoves = () => this.moves;
    public getCurrentTurn = () => this.currentTurn;

}