import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import {adjacentSquares} from "../../helpers/Adjacency";
import {FIDE_EXPANSION} from "../Expansions";

export default class BattlePlan_Card extends Card {

    public readonly cardName = "Battle Plan";
    public readonly description = "Draw 3 cards";

    public readonly targets = 1; //Drag literally anywhere to play it.
    public readonly fast = false;
    public readonly cost = 12;

    public readonly shortName = "_BPln";
    public static readonly id = "battleplan";
    public readonly id = BattlePlan_Card.id;
    public readonly expac = FIDE_EXPANSION;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        board.forEach((piece, index) => validTargets.push(index));
        return validTargets;
    }]

    public playCard = ( targets: number[], game: Game ) => {
        let currentCol = game.getCurrentTurn();
        game.DrawCard(currentCol, 3)
    }
}