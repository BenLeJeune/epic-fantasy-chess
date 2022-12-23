import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import {adjacentSquares} from "../../helpers/Adjacency";
import {CRUSADER_EXPANSION} from "../Expansions";

export default class Clergy_Card extends Card {

    public readonly cardName = "Clergy";
    public readonly description = "Summon 2 pawns next to each other";

    public readonly targets = 2; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 15;

    public readonly shortName = "_Clrg";
    public static readonly id = "clergy";
    public readonly id = Clergy_Card.id;
    public readonly expac = CRUSADER_EXPANSION;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        if (!previousTargets || previousTargets.length === 0) board.forEach(( piece, index ) => { /// FIRST PIECE
            if (piece === Piece.None) {
                /// MUST BE ADJACENT TO A FRIENDLY PIECE
                if (adjacentSquares(index).filter( adj => sameColour(colour, board[adj]) ).length > 0) validTargets.push(index);
            }
        });
        else board.forEach((piece, index) => {//Second Piece
            if (piece === Piece.None) {
                if (adjacentSquares(previousTargets ? previousTargets[0] : index).indexOf(index) !== -1) validTargets.push(index);
            }
        })
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        game.updateGameBoard( board => {
            //board[targetSquare] = Piece.Pawn * game.getCurrentTurn() > 0 ? 1 : -1
            targets.forEach(target => {
                //board[target] = Piece.Pawn * game.getCurrentTurn() > 0 ? 1 : -1
                game.Move(target, target, "PROMOTION", {isCardMove: true, promotionTo: Piece.Pawn * game.getCurrentTurn()})
            })
        });
    }
}