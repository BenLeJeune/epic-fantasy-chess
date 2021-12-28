import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";

export default class Anoint_Card extends Card {

    public readonly cardName = "Anoint";
    public readonly description = "A friendly pawn promotes into a bishop.";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 0;

    public readonly shortName = "_Anoi";
    public static readonly id = "anonit";
    public readonly id = Anoint_Card.id;

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
            game.Move(target, target, "PROMOTION", {isCardMove: true, promotionTo: Piece.Bishop * game.getCurrentTurn()})
        } )
    }
}