import Game, {AdditionalOptions} from "../Classes/Game";
import {filterLegalMoves, isCheck} from "../helpers/Checks";
import Board from "../Classes/Board";
import {positionalEngineEvaluation} from "../helpers/Evaluation";
import includePromotion, {PromotionMove} from "./IncludePromotions";
import {legalMove} from "../types";
import TranspositionTable from "./HashTable";
import {arraysAreEqual} from "../helpers/Utils";
import Piece from "../Classes/Piece";

///
/// MINIMAX ALGORITHM FOR FINDING MOVES
///

//If we're maximising (white), then it will have just been black's turn
//If we're minimising (black), then it will have just been white's turn
// ALPHA represents the MIN score the MAXIMISING player is guaranteed
// BETA represents the MAX score the MINIMISING player is guaranteed

const miniMax = (g : Game, depth : number, maximising : boolean, army: number[], hashGet:(b:number[])=>number|null, hashSet:(b:number[],e:number)=>void, counter:()=>void, alpha:number = -Infinity, beta:number = Infinity ) => {
    let col = maximising ? 1 : -1 as 1 | -1;

    let partialLegalCaptures =  Board.getLegalMoves( g.getBoard(), g.getMoves(), { colour: col, mode: "captures" } )
    let partialLegalMoves =  Board.getLegalMoves( g.getBoard(), g.getMoves(), { colour: col, mode: "moves" } )
    // let partialLegalMoves = Board.getLegalMoves( g.getBoard(), g.getMoves(), { colour: col } )
    let filteredLegalMoves = filterLegalMoves( partialLegalMoves, g.getBoard(), g.getMoves(), col )
    let filteredLegalCaptures = filterLegalMoves( partialLegalCaptures, g.getBoard(), g.getMoves(), col )
    let unorderedMoves = includePromotion( g.getBoard(), filteredLegalMoves, army, col );
    let unorderedCaptures = includePromotion( g.getBoard(), filteredLegalCaptures, army, col );

    //We want to order our moves.
    let orderedPromotionMoves = [...unorderedMoves, ...unorderedCaptures].filter( m => m.additional?.promotionTo )
        .sort(( p, n ) =>
            (Piece.getPiece(n.additional?.promotionTo||1)?.engineValue || 0) - ( Piece.getPiece(p.additional?.promotionTo||1)?.engineValue || 0 ))

    let orderedCaptures = unorderedCaptures.sort(( p, n ) => (Piece.getPiece( g.getBoard()[n.move.to] )?.engineValue || 0) - (Piece.getPiece( g.getBoard()[p.move.to] )?.engineValue || 0) )

    let orderedPawnMoves = unorderedMoves.filter( m => g.getBoard()[m.move.to] === 0 && g.getBoard()[m.move.from] === col * Piece.Pawn )
        .sort(( p, n ) => col * (Piece.getRank( n.move.to ) - Piece.getRank( n.move.to )) ) //Moving pawns further up
        .sort(( p, n ) => Math.abs( 4.5 - Piece.getFile(p.move.to) ) - Math.abs( 4.5 - Piece.getFile(n.move.to) )) //Moving pawns towards the centre
    let remainingMoves = unorderedMoves.filter( m => g.getBoard()[m.move.to] === 0  && g.getBoard()[m.move.from] !== col * Piece.Pawn ) ;

    let legalMoves = [
        ...orderedPromotionMoves, /// PROMOTING IS USUALLY GOOD,
        ...orderedCaptures, /// THEN CAPTURES
        ...orderedPawnMoves, /// THEN MOVING PAWNS
        ...remainingMoves /// THEN THE REST
    ];

    let isCheckMate = isCheck( g.getBoard(), g.getMoves(), col) && legalMoves.length === 0;

    if ( depth === 0 || isCheckMate || ( depth <= 0 && unorderedCaptures.length === 0 ) ) {
        //We've reached the end! Return the final evaluation
        let ev = positionalEngineEvaluation( g.getBoard(), g.getMoves() );
        hashSet( g.getBoard(), ev )
        counter()
        return [ ev , { move: { from: -1, to: -1 } } ] as [ number, PromotionMove ];
    }
    else {
        //The evaluation hasn't finished yet!

        let value = maximising ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        let move = legalMoves[0];

        for ( let { move: m, additional } of legalMoves ) {
            g.Move( m.from, m.to, m.special, additional );
            let hashedEval = hashGet( g.getBoard() );
            let ev : number = hashedEval || miniMax(g, depth - 1, !maximising, army, hashGet, hashSet, counter, alpha, beta)[0];
            if (!hashedEval) {
                hashSet(g.getBoard(), ev);
            }
            //Return straight away if we find a forced mate.
            g.UnMove()
            function update() {
                value = ev;
                move = { move: m, additional }
            }
            if (maximising) {
                if ( value <= ev) update()
                if ( value >= beta ) break; //β cutoff
                alpha = Math.max( alpha, value );
            }
            else {
                if (value >= ev) {
                    value = ev;
                    move =  { move : m, additional };
                }
                if ( value <= alpha ) break; //α cutoff
                beta = Math.min( beta, value )
            }
        }

        return [ value, move ] as [ number, PromotionMove ];

    }

}

export default miniMax;