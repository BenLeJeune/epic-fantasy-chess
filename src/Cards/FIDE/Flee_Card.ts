import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import Bishop from "../../Pieces/FIDE/Bishop";
import Knight from "../../Pieces/FIDE/Knight";
import {adjacentSquares} from "../../helpers/Adjacency";

export default class Flee_Card extends Card {

    public readonly cardName = "Flee";
    public readonly description = "Your king moves to a square adjacent to a friendly piece.";

    public readonly targets = 2; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 25;

    public readonly shortName = "_Flee";
    public static readonly id = "flee";
    public readonly id = Flee_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        if (!previousTargets || previousTargets.length === 0) board.forEach(( piece, index ) => {
            if ( sameColour(piece, colour)
                && Piece.getPiece(piece)?.categories.indexOf("King") !== -1 ) validTargets.push(index);
        });
        else {
            board.forEach(( piece, index ) => {
                if (piece === Piece.None) {
                    if (adjacentSquares(index).filter( adj => sameColour(colour, board[adj]) ).length > 0) validTargets.push(index);
                }
            });
        }
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        let [ king, destination ] = targets;
        game.Move( king, destination, undefined, { isCardMove: true } )
    }
}