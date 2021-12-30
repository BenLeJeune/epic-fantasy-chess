import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import {filterLegalMoves} from "../../helpers/Checks";
import GamePiece from "../../Pieces/GamePiece";
import OngoingEffect from "../../Classes/OngoingEffect";
import {CRUSADER_EXPANSION} from "../Expansions";

export default class Convert_Card extends Card {

    public readonly cardName = "Convert";
    public readonly description = "Choose an enemy piece you can capture. You take control of it instead.";

    public readonly targets = 1; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 18;

    public readonly shortName = "_Convt";
    public static readonly id = "convert";
    public readonly id = Convert_Card.id;
    public readonly expac = CRUSADER_EXPANSION;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[], effects?:OngoingEffect[] ) => {
        let validTargets : number[] = [];
        board.forEach((piece, index) => {
            if (sameColour(piece, colour)) {
                if (Piece.getPiece(piece)) {
                    filterLegalMoves(
                        (Piece.getPiece(piece) as GamePiece).getLegalMoves(index, board, "captures", colour, history),
                        board, history, colour, effects || ([] as OngoingEffect[])
                    ).forEach((capture) => {
                        validTargets.push(capture.to)
                    })
                }
            }
        })
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        game.updateGameBoard( board => {
            targets.forEach(target => {
                board[target] = -board[target];
            })
        } )
    }
}