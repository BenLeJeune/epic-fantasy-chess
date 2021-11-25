import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";

export default class Expendable_Card extends Card {

    public cardName = "Expendable";
    public description = "Summon a pawn.";

    public targets = 1; //Simply choose a square

    public getValidTargets = ( board: number[], colour:number, history:ActualMove[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => {
            if (piece === Piece.None) validTargets.push(index);
        });
        return validTargets;
    }

    public playCard = ( targets: number[], board:number[], colour: number, game: Game ) => {
        let targetSquare = targets[0]; //Only have one target
        game.updateGameBoard( board => {
            board[targetSquare] = Piece.Pawn * colour > 0 ? 1 : -1
        });
    }
}