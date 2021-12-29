import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import OngoingEffect from "../../Classes/OngoingEffect";

export default class Hallow_Card extends Card {

    public readonly cardName = "Hallow";
    public readonly description = "A non-king piece cannot capture or be captured for 1 turn.";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = true;
    public readonly cost = 0;

    public readonly shortName = "_Hlow";
    public static readonly id = "hallow";
    public readonly id = Hallow_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => {
            if (piece !== Piece.None && Math.abs(piece) !== Piece.King ) validTargets.push(index)
        });
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        const description = "This piece has been hallowed, and cannot capture or be captured."
        targets.forEach( target => {
            game.addOngoingEffect( new OngoingEffect( target, "no-captures", 1, description )  )
        } )
    }
}