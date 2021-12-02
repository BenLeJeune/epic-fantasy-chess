import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";

export default class Advance_Card extends Card {

    public readonly cardName = "Advance";
    public readonly description = "Move 2 pawns forward one.";

    public readonly targets = 2; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 0;

    public readonly shortName = "_Advn";
    public static readonly id = "advance";
    public readonly id = Advance_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => {
            if (piece === Piece.Pawn * colour && Piece.getRank(index) !== ( colour > 0 ? 7 : 0 )
                && board[index + (8*colour)] === Piece.None) validTargets.push(index);
        });
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        targets.forEach( target => {
            game.Move(target, target + (8 * game.getCurrentTurn()), undefined, {isCardMove: true})
        } )
    }
}