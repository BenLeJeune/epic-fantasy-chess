import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import {adjacentSquares} from "../../helpers/Adjacency";

export default class Envoy_Card extends Card {

    public readonly cardName = "Envoy";
    public readonly description = "Summon a dummy pawn that cannot capture or promote adjacent to a friendly piece";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = true;
    public readonly cost = 0;

    public readonly shortName = "_Envy";
    public static readonly id = "envoy";
    public readonly id = Envoy_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => {
            if (piece === Piece.None) {
                if (adjacentSquares(index).filter( adj => sameColour(colour, board[adj]) ).length > 0) validTargets.push(index);
            }
        });
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        game.updateGameBoard( board => {
            targets.forEach(target => {
                board[target] = Piece.DummyPawn * (game.getCurrentTurn() > 0 ? 1 : -1)
            })
        });
    }
}