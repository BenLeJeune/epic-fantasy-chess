import Game from "../Classes/Game";
import OpeningBook from "./openings.json";
import {legalMove} from "../types";
import Board from "../Classes/Board";
import {filterLegalMoves} from "../helpers/Checks";
import Piece from "../Classes/Piece";
import {PromotionMove} from "./IncludePromotions";

///
/// QUERYING THE OPENING BOOK
///

const queryOpeningBook = (g : Game ) => {

    //We want to see if there are any openings left
    let b = g.getBoard();
    let h = g.getMoves();

    let moves = [] as legalMove[];

    for ( let opening of OpeningBook ) {

        let om = opening.moves;
        //An array in form [ "e4", "Nf6", "e5", "Nd5" ]
        let parsedOM = om.split(" ").filter( m => m.indexOf(".") === -1 );

        let isMatch = true;

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
            const legal = filterLegalMoves(pseudo, b, h, col );
            //We want to find which piece moved to where
            let validMove = legal.filter(m => Piece.getPiece( b[m.from] )?.shortName.toLowerCase() === moving.toLowerCase()
                && Piece.getSquareName( m.to ).toLowerCase() === toStr.toLowerCase() );

            if (validMove?.length >= 0) {
                moves.push(validMove[0])
                console.log(`Identified: the ${ opening.name }`)
            }

        }

    }

    return moves[0] ? {move: moves[0]} as PromotionMove : null

}

export default queryOpeningBook;