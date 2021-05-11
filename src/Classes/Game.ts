import Board from "./Board"

export default class Game {

    private turnNumber : number
    private playerTurn : 1 | 2
    private board : Board

    constructor() {
        this.turnNumber = 0;
        this.playerTurn = 1;
        this.board = new Board();
    }

    //Accessor Methods
    public getTurnNumber : () => number = () => this.turnNumber;
    public getPlayerTurn : () => 1 | 2 = () => this.playerTurn;
    public getBoard : () => Board = () => this.board;

    public setTurnNumber : (n:number) => void = turnNumber => { this.turnNumber = turnNumber };
    public setPlayerTurn : ( n : 1 | 2 ) => void = turn => { this.playerTurn = turn };

}