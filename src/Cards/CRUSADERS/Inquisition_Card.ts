import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import {adjacentSquares} from "../../helpers/Adjacency";
import {CRUSADER_EXPANSION} from "../Expansions";

export default class Inquisition_Card extends Card {

    public readonly cardName = "Inquisition";
    public readonly description = "A pawn moves forward 2";

    public readonly targets = 1;
    public readonly fast = false;
    public readonly cost = 0;

    public readonly shortName = "_Inqu";
    public static readonly id = "inquisition";
    public readonly id = Inquisition_Card.id;
    public readonly expac = CRUSADER_EXPANSION;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => {
            if ( piece === Piece.Pawn * colour && board[index + ( 16 * colour )] === Piece.None ) validTargets.push(index);
        })
        return validTargets;
    }]

    public playCard = ( targets: number[], game: Game ) => {
        let [ target ] = targets;
        let colour = game.getCurrentTurn();
        game.Move( target, target + (16 * colour), "DOUBLE", {isCardMove: true} )
    }
}