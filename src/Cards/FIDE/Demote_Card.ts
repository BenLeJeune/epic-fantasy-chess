import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";

export default class Demote_Card extends Card {

    public readonly cardName = "Demote";
    public readonly description = "An opposing minor piece demotes to a pawn.";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 12;

    public readonly shortName = "_Dmot";
    public static readonly id = "demote";
    public readonly id = Demote_Card.id;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => {
            if (Piece.getPiece(piece)?.categories.indexOf("Minor") !== -1
                && Piece.getPiece(piece)?.categories.indexOf("Pawn") === -1
                && differentColours(colour, piece)) validTargets.push(index);
        });
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        targets.forEach( target => {
            game.Move(target, target, "PROMOTION", {isCardMove: true, promotionTo: -Piece.Pawn * game.getCurrentTurn()})
        } )
    }
}