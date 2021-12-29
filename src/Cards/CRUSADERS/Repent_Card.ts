import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import OngoingEffect from "../../Classes/OngoingEffect";

export default class Repent_Card extends Card {

    public readonly cardName = "Repent";
    public readonly description = "Choose a non-king enemy piece. Your opponent cannot move it next turn.";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = true;
    public readonly cost = 0;

    public readonly shortName = "_Rpnt";
    public static readonly id = "repent";
    public readonly id = Repent_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => {
            if (piece !== Piece.None && piece !== (-colour * Piece.King) && !sameColour(piece, colour)) validTargets.push(index)
        });
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        const description = "This piece is repenting. It cannot be moved normally (Can still be moved by cards)."
        targets.forEach( target => {
            game.addOngoingEffect( new OngoingEffect( target, "no-moves", 1, description )  )
        } )
    }
}