import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import {adjacentSquares} from "../../helpers/Adjacency";

export default class Adjust_Card extends Card {

    public readonly cardName = "Adjust";
    public readonly description = "A piece makes one move rookwise";

    public readonly targets = 2;
    public readonly fast = false;
    public readonly cost = 0;

    public readonly shortName = "_Adjs";
    public static readonly id = "adjust";
    public readonly id = Adjust_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        if (previousTargets && previousTargets[0]) { //Making the follow up move
            let prevSquare = previousTargets[0];
            adjacentSquares(prevSquare, false).forEach(square => {
                if (board[square] === Piece.None) validTargets.push(square);
            })
        }
        else { //IF THE FIRST ONE
            board.forEach(( piece, index ) => {
                if ( sameColour( piece, colour ) ) {
                    if ( adjacentSquares(index, false).filter(adjSq => board[adjSq] === Piece.None).length > 0 ) validTargets.push(index);
                }
            });
        }
        return validTargets;
    }]

    public playCard = ( targets: number[], game: Game ) => {
        let [ from, to ] = targets;
        game.Move( from, to, undefined, {isCardMove: true} )
    }
}