import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";

export default class Mount_Card extends Card {

    public readonly cardName = "Mount";
    public readonly description = "A friendly pawn promotes into a knight.";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 10;

    public readonly shortName = "_Moun";
    public static readonly id = "mount";
    public readonly id = Mount_Card.id;

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
            game.Move(target, target, "PROMOTION", {isCardMove: true, promotionTo: Piece.Knight * game.getCurrentTurn()})
        } )
    }
}