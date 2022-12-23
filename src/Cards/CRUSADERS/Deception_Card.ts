import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import {adjacentSquares} from "../../helpers/Adjacency";
import {CRUSADER_EXPANSION} from "../Expansions";

export default class Deception_Card extends Card {

    public readonly cardName = "Deception";
    public readonly description = "Swap any 2 friendly pieces";

    public readonly targets = 2; //Simply choose a square
    public readonly fast = false;
    public readonly cost = 12;

    public readonly shortName = "_Dcep";
    public static readonly id = "deception";
    public readonly id = Deception_Card.id;
    public readonly expac = CRUSADER_EXPANSION;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        board.forEach(( piece, index ) => { /// FIRST PIECE
            if (piece !== Piece.None && sameColour(piece, colour)) {
                validTargets.push(index);
            }
        });
        return validTargets.filter(target => !previousTargets || previousTargets.length === 0 || previousTargets.indexOf(target) === -1);
    }]

    public playCard = ( targets: number[], game: Game ) => {
        // let targetSquare = targets[0]; //Only have one target
        let [ square1, square2 ] = targets;
        game.updateGameBoard(board => {
            let piece1 = board[square1], piece2 = board[square2];
            board[square1] = piece2;
            board[square2] = piece1;
        })
    }

    public trackPiece = ( square: number, targets: number[] ) => {
        if (targets.length === this.targets) {
            let [target1, target2] = targets;
            // If the square was either one of the squares we targeted, then we do this!
            if (square === target1) return target2;
            else if (square === target2) return target1;
        }

        return square;
    }
}