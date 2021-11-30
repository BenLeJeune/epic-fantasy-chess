import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";

export default class Expendable_Card extends Card {

    public readonly cardName = "Expendable";
    public readonly description = "Summon a pawn.";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = false;

    public readonly shortName = "_Exp";
    public static readonly id = "expendable";
    public readonly id = Expendable_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = ( board: number[], colour:number, history:ActualMove[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => {
            if (piece === Piece.None) {
                if ( Piece.getFile(index) > 0 && sameColour(colour, board[index - 1])) validTargets.push(index); //left
                if (Piece.getFile(index) < 7 && sameColour(colour, board[index + 1])) validTargets.push(index); //right
                if ( Piece.getRank(index) > 0 && sameColour(colour, board[index - 8]) ) validTargets.push(index); //below
                if (Piece.getRank(index) < 7 && sameColour(colour, board[index + 8])) validTargets.push(index);  //above
            }
        });
        return validTargets;
    }

    public playCard = ( targets: number[], game: Game ) => {
        let targetSquare = targets[0]; //Only have one target
        game.updateGameBoard( board => {
            board[targetSquare] = Piece.Pawn * game.getCurrentTurn() > 0 ? 1 : -1
        });
    }
}