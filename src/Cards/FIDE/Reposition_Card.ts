import Card from "../Card";
import Piece from "../../Classes/Piece";
import ActualMove from "../../Classes/Move";
import Game from "../../Classes/Game";
import {differentColours, sameColour} from "../../helpers/DifferentColours";
import {adjacentSquares} from "../../helpers/Adjacency";
import {FIDE_EXPANSION} from "../Expansions";

export default class Reposition_Card extends Card {

    public readonly cardName = "Reposition";
    public readonly description = "Swap 2 adjacent friendly pieces";

    public readonly targets = 2; //Choose two pieces
    public readonly fast = false;
    public readonly cost = 8;

    public readonly shortName = "_Rpos";
    public static readonly id = "reposition";
    public readonly id = Reposition_Card.id;
    public readonly expac = FIDE_EXPANSION;

    public readonly unMoveType = "boardState" as "boardState";

    public getValidTargets = [( board: number[], colour:number, history:ActualMove[], previousTargets?:number[] ) => {
        let validTargets : number[] = [];
        if (!previousTargets || previousTargets.length === 0) board.forEach(( piece, index ) => { /// FIRST PIECE
            if (piece !== Piece.None && sameColour(piece, colour)) {
                /// MUST BE ADJACENT TO A FRIENDLY PIECE
                if (adjacentSquares(index).filter( adj => sameColour(piece, board[adj]) ).length > 0) validTargets.push(index);
            }
        });
        else board.forEach((piece, index) => {
            if (piece !== Piece.None && sameColour(piece, colour)) {
                if (adjacentSquares(previousTargets ? previousTargets[0] : index).indexOf(index) !== -1) validTargets.push(index);
            }
        })
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