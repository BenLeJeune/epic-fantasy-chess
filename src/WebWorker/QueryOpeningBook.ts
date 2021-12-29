import Game from "../Classes/Game";
import OpeningBook from "./openings.json";
import {legalMove} from "../types";
import Board from "../Classes/Board";
import {filterLegalMoves} from "../helpers/Checks";
import Piece from "../Classes/Piece";
import {PromotionMove} from "./IncludePromotions";
import {randomFromList} from "../helpers/Utils";
import { ActualMoves } from "../helpers/MoveFilter";

///
/// QUERYING THE OPENING BOOK
///

const queryOpeningBook = ( g : Game, firstMove: boolean = false ) => {

    //We want to see if there are any openings left
    let b = g.getBoard();
    let h = ActualMoves(g.getMoves());

    let moves = [] as legalMove[];
    let openingName = "";

    for ( let opening of OpeningBook ) {

        let om = opening.moves;

        //However, if we're on the very first opening, we can just select one randomly
        if (firstMove ) {
            let randomOpening = randomFromList(Object.values(OpeningBook));
            om = randomOpening.moves;
        }

        // console.log(`Random Opening: ${ randomOpening }`)

        //An array in form [ "e4", "Nf6", "e5", "Nd5" ]
        let parsedOM = om.split(" ").filter( m => m.indexOf(".") === -1 );

        let isMatch = true;

        //Go through the history one by one
        h.forEach( (move, index) => {
            if ( move.getMoveName() !== parsedOM[index] ) {
                isMatch = false;
            }
        } )

        if (isMatch && parsedOM[h.length]) {

            let nextMove = parsedOM[ h.length ];
            let toStr = nextMove.length === 3 ? nextMove.substr(1, 3) : nextMove
            let moving = nextMove.length === 3 ? nextMove[0] : "P"
            let col = h.length % 2 === 0 ? 1 : -1;
            const pseudo = Board.getLegalMoves(b, h, { colour :  col })
            const legal = filterLegalMoves(pseudo, b, h, col, g.getCurrentOngoingEffects() );

            //If in the form Nbd2, we also want to be able to know which piece to move
            let movingFrom = nextMove.length === 4 ? nextMove[2] : null;

            //We also need to account for capturing pieces
            if ( nextMove.indexOf("x") !== -1 ) {
                //THERE WAS A CAPTURE INVOLVED - typically in format exd6
                if (nextMove.length === 4) {
                    ///IN FORMAT exd6
                    toStr = nextMove.substr(2);
                    if ( nextMove[0] === nextMove[0].toLowerCase() ) {
                        //Is a pawn capturing something
                        //Try and find where the pawn is moving from
                        b.map((p, s) => p === Piece.Pawn * col && Piece.getSquareName(s)[0] === nextMove[0]
                            ? movingFrom = Piece.getSquareName(s) : () => {})
                        moving = "P";

                    }
                    else {
                        //Is a non-pawn capturing something - eg Nxd7
                        moving = nextMove[0];
                        b.map((p, s) => Piece.getPiece(p)?.shortName.toLowerCase() === moving.toLowerCase()
                            && Piece.getSquareName(s)[0] === nextMove[0] ? movingFrom = Piece.getSquareName(s) : () => {})
                    }
                }
            }

            //We want to find which piece moved to where
            let validMove = legal.filter(m => Piece.getPiece( b[m.from] )?.shortName.toLowerCase() === moving.toLowerCase()
                && Piece.getSquareName( m.to ).toLowerCase() === toStr.toLowerCase()
                && ( !movingFrom || Piece.getSquareName(m.from) === movingFrom || Piece.getSquareName(m.from)[0] === movingFrom ) );

            if (validMove?.length > 0) {
                moves.push(validMove[0])
                if (firstMove) return [{ move: validMove[0]}, opening.name ]
                if (parsedOM.length === h.length + 1) openingName = opening.name
                // console.log(`Identified: the ${ opening.name }`)
            }

        }

    }
    return moves[0] ? [{move: randomFromList(moves)}, openingName] as [PromotionMove, string] : [null, null]

}

export default queryOpeningBook;