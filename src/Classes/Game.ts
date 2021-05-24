import {Move} from "../types";
import {generateFIDEBoard} from "../helpers/BoardGenerators";

export default class Game {

    private readonly board : number[]

    private currentTurn : number;

    private readonly moves : Move[]

    public Move = ( from : number, to : number ) => {
        //Let's add the move function
        //Keeping it simple for now, let's just make the move. Forcefully.
        this.moves.push( {
            from, to,
            piece : this.board[to]
        } );

        //Let's move the piece on To to From.
        this.board[to] = this.board[from];
        this.board[from] = 0;

    }

    public UnMove = () => {}

    constructor() {
        this.board = generateFIDEBoard();
        this.moves = [] as Move[];
        this.currentTurn = 1;
    }

    public getBoard = () => this.board;
    public getMoves = () => this.moves;
    public getCurrentTurn = () => this.currentTurn;

}