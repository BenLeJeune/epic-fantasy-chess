import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";

export default class TacticalRetreat_Card extends Card {

    public readonly cardName = "Tactical Retreat";
    public readonly description = "Move a piece back 2 squares.";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = true;
    public readonly cost = 5;

    public readonly shortName = "_Tcrt ";
    public static readonly id = "tactical-retreat";
    public readonly id = TacticalRetreat_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => {
            if ( sameColour( piece, colour )
                && ( (colour > 0 && Piece.getRank(index) >= 2) || (colour < 0 && Piece.getRank(index) <=5) )
                && board[index - (8*colour)] === Piece.None
                && board[index - (16*colour)] === Piece.None ) validTargets.push(index);
        });
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        targets.forEach( target => {
            game.Move(target, target - (16 * game.getCurrentTurn()), undefined, {isCardMove: true})
        } )
    }
}