import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import {adjacentSquares} from "../../helpers/Adjacency";
import {FIDE_EXPANSION} from "../Expansions";

export default class Expendable_Card extends Card {

    public readonly cardName = "Expendable";
    public readonly description = "Summon a pawn adjacent to a friendly piece.";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 4;

    public readonly shortName = "_Expd";
    public static readonly id = "expendable";
    public readonly id = Expendable_Card.id;
    public readonly expac = FIDE_EXPANSION;

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
        // let targetSquare = targets[0]; //Only have one target
        // game.updateGameBoard( board => {
        //     //board[targetSquare] = Piece.Pawn * game.getCurrentTurn() > 0 ? 1 : -1
        //     targets.forEach(target => {
        //         board[target] = Piece.Pawn * game.getCurrentTurn() > 0 ? 1 : -1
        //     })
        // });
        targets.forEach( targetSquare => {
            game.Move(targetSquare, targetSquare, "PROMOTION", {isCardMove: true, promotionTo: Piece.Pawn * game.getCurrentTurn()})
        } )
    }
}