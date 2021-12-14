import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import {getLegalRiderMoves} from "../../helpers/RiderMoves";

export default class Promotion_Card extends Card {

    public readonly cardName = "Promotion";
    public readonly description = "A friendly pawn advances as far up its file as possible. If it reaches the back rank, it becomes a Rook.";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 30;

    public readonly shortName = "_Prmo";
    public static readonly id = "promotion";
    public readonly id = Promotion_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => {
            if (piece === Piece.Pawn * colour) validTargets.push(index);
        });
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        targets.forEach( target => {
            const rider = getLegalRiderMoves( game.getBoard(), target, game.getBoard()[target], [
                p => p + ( 8 * game.getCurrentTurn() )
            ], "moves" );
            let final = rider[rider.length - 1];
            if ( (Piece.getRank(final.to) === 7 && game.getCurrentTurn() > 0)
                || (Piece.getRank(final.to) === 0 && game.getCurrentTurn() < 0) ) {
                game.Move(target, final.to, "PROMOTION", {isCardMove: true, promotionTo: Piece.Rook * game.getCurrentTurn()})
            }
            else game.Move(target, final.to, undefined, {isCardMove: true})
        } )
    }
}