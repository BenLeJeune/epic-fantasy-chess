import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";

export default class Expendable_Card extends Card {

    public cardName = "Expendable";
    public description = "Summon a pawn.";

    public targets = 1; //Simply choose a square
    public fast = false;

    public unMoveType = "boardState" as "boardState";

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

    public playCard = ( targets: number[], board:number[], colour: number, game: Game ) => {
        let targetSquare = targets[0]; //Only have one target
        game.updateGameBoard( board => {
            board[targetSquare] = Piece.Pawn * colour > 0 ? 1 : -1
        });
    }
}