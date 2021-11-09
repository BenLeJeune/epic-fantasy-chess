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

const miniMax = (g : Game, depth : number, maximising : boolean, army: number[], hashGet:(b:number[])=>[number, number, boolean]|null, hashSet:(b:number[],e:number,t:number,q:boolean)=>void, counter:()=>void, original_depth:number = depth, alpha:number = -Infinity, beta:number = Infinity ) => {

    ///Another exit point
    ///Returned values are meaningless, won't read them

    let col = maximising ? 1 : -1 as 1 | -1;

    let partialLegalCaptures =  Board.getLegalMoves( g.getBoard(), g.getMoves(), { colour: col, mode: "captures" } )
    let partialLegalMoves =  Board.getLegalMoves( g.getBoard(), g.getMoves(), { colour: col, mode: "moves" } )
    // let partialLegalMoves = Board.getLegalMoves( g.getBoard(), g.getMoves(), { colour: col } )
    // let filteredLegalMoves = filterLegalMoves( partialLegalMoves, g.getBoard(), g.getMoves(), col )
    // let filteredLegalCaptures = filterLegalMoves( partialLegalCaptures, g.getBoard(), g.getMoves(), col )
    let unorderedMoves = includePromotion( g.getBoard(), partialLegalMoves, army, col );
    let unorderedCaptures = includePromotion( g.getBoard(), partialLegalCaptures, army, col );

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

    let isCheckMate = isCheck( g.getBoard(), g.getMoves(), col) && legalMoves.length === 0; //am I in check?
    let oppoonentLegalCaptures =  Board.getLegalMoves( g.getBoard(), g.getMoves(), { colour: -col, mode: "captures" } )

    if ( depth === -3 || isCheckMate || ( depth <= 0 && filterLegalMoves(oppoonentLegalCaptures, g.getBoard(), g.getMoves(), col).length === 0 )) {
        //We've reached the end! Return the final evaluation
        let quiescence_quiet =filterLegalMoves(oppoonentLegalCaptures, g.getBoard(), g.getMoves(), col).length === 0
        let ev = positionalEngineEvaluation( g.getBoard(), g.getMoves(), g.getPieceIndexes() );
        hashSet( g.getBoard(), ev, g.getMoves().length + depth, quiescence_quiet || isCheckMate ); //Will return quiet if there are no captures available, or if checkmate
        counter()
        return [ ev , { move: { from: -1, to: -1 } }, g.getMoves().length, quiescence_quiet || isCheckMate ] as [ number, PromotionMove, number, boolean ];
    }
    else {
        //The evaluation hasn't finished yet!

        let value = maximising ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        let move = legalMoves[0];
        let quiet = false;
        let move_depth = depth;

        //THERE ARE SOME THINGS WE HAVE TO FILTER - CASTLING
        let partFilter = legalMoves.filter( ({move}) => {
            //THERE ARE SOME SPECIAL RULES FOR SPECIAL MOVES
            if ( move.special === "CASTLE") {
                if ( isCheck( g.getBoard(), g.getMoves(), col ) ) return false; //Cannot castle out of check
                let kingsRook = col > 0 ? 7 : 63;
                let queensRook = col > 0 ? 0 : 56;
                if ( move.to === kingsRook - 1 && Board.isThreatened( kingsRook - 2, g.getBoard(), g.getMoves(), -col )) return false;
                if ( move.to === queensRook + 2 && Board.isThreatened( queensRook + 3, g.getBoard(), g.getMoves(), -col ) ) return false;
            }

            return true;
        } )

        for ( let { move: m, additional } of partFilter ) {

            /// THIS IS WHERE WE CHECK FOR OUR CONDITION
            /// IF THE CONDITION IS FALSE, OUR TIME IS UP!
            /// WE WON'T BE USING THE RETURNED VALUE, ONLY UTILISING THE TRANSPOSITION TABLE

            g.Move( m.from, m.to, m.special, additional );

            if (!isCheck(g.getBoard(), g.getMoves(), col)) {

                let hashedEval = hashGet(g.getBoard());
                let ev:number = 0;
                let temp_quiet = false;
                let temp_depth = 0;

                //Where we started this evaluation from
                let evaluatingFrom = g.getMoves().length + depth - original_depth;

                if ( hashedEval && ( hashedEval[2]  || ( hashedEval[1] - evaluatingFrom >= 2)) ) {
                    ev = hashedEval[0]
                    temp_depth = hashedEval[1]
                    temp_quiet = hashedEval[2]
                }
                else {
                    let minmax =  miniMax(g, depth - 1, !maximising, army, hashGet, hashSet, counter, original_depth, alpha, beta);
                    ev = minmax[0]

                    //Here we can do some special evaluations
                    if (g.getMoves().length <= 20 || g.getBoard().filter(p => p !== Piece.None).length >= 24 ) {
                        //We're still roughly in the opening
                        if ( Math.abs(g.getBoard()[m.from]) === Piece.Pawn ) ev += 30 //Encourage pawn moves
                        else if ( Math.abs(g.getBoard()[m.from]) === Piece.Knight || Math.abs(g.getBoard()[m.from]) === Piece.Bishop ) ev += 15 //Encourage pawn moves
                    }

                    temp_depth = minmax[2]
                    temp_quiet = minmax[3]
                    hashSet(g.getBoard(), ev, g.getMoves().length, temp_quiet);
                }
                //Return straight away if we find a forced mate.
                g.UnMove()

                function update() {
                    value = ev;
                    move = {move: m, additional}
                    quiet = temp_quiet
                    move_depth = temp_depth;
                }

                if (maximising) {
                    if (value <= ev) update()
                    if (value >= beta) break; //β cutoff
                    alpha = Math.max(alpha, value);
                } else {
                    if (value >= ev) {
                        value = ev;
                        move = {move: m, additional};
                    }
                    if (value <= alpha) break; //α cutoff
                    beta = Math.min(beta, value)
                }
            }
            else g.UnMove()
        }

        return [ value, move, move_depth, quiet ] as [ number, PromotionMove, number, boolean ];

    }

}

export default miniMax;