import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import Bishop from "../../Pieces/FIDE/Bishop";
import Knight from "../../Pieces/FIDE/Knight";

export default class Maneuver_Card extends Card {

    public readonly cardName = "Maneuver";
    public readonly description = "A bishop makes a knight move.";

    public readonly targets = 2; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 15;

    public readonly shortName = "_Mnvr";
    public static readonly id = "maneuver";
    public readonly id = Maneuver_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        if (!previousTargets || previousTargets.length === 0) board.forEach(( piece, index ) => {
            if ( sameColour(piece, colour)
                && Piece.getPiece(piece)?.categories.indexOf("Bishop") !== -1 ) validTargets.push(index);
        });
        else {
            let knightMoves = new Knight().getLegalMoves( previousTargets[0], board, "moves", colour );
            board.forEach((piece, index) => {
                if (knightMoves.filter(move => move.to === index).length > 0) validTargets.push(index);
            })
        }
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        let [ target, destination ] = targets;
        game.Move( target, destination, undefined, { isCardMove: true } )
    }
}