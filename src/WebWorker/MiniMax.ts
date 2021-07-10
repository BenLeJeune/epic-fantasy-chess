import Game from "../Classes/Game";
import {filterLegalMoves, isCheck} from "../helpers/Checks";
import Board from "../Classes/Board";
import {positionalEngineEvaluation} from "../helpers/Evaluation";
import includePromotion, {PromotionMove} from "./IncludePromotions";

///
/// MINIMAX ALGORITHM FOR FINDING MOVES
///

//If we're maximising (white), then it will have just been black's turn
//If we're minimising (black), then it will have just been white's turn
const miniMax = (g : Game, depth : number, maximising : boolean, army: number[] ) => {
    let col = maximising ? 1 : -1 as 1 | -1;

    let partialLegalMoves = Board.getLegalMoves( g.getBoard(), g.getMoves(), { colour: col } )
    let filteredLegalMoves = filterLegalMoves( partialLegalMoves, g.getBoard(), g.getMoves(), col )
    let legalMoves = includePromotion( g.getBoard(), filteredLegalMoves, army, col );

    let isCheckMate = isCheck( g.getBoard(), g.getMoves(), col) && legalMoves.length === 0;

    if ( depth === 0 || isCheckMate ) {
        //We've reached the end! Return the final evaluation
        return [ positionalEngineEvaluation( g.getBoard(), g.getMoves() ), { move: { from: -1, to: -1 } } ] as [ number, PromotionMove ];
    }
    else {
        //The evaluation hasn't finished yet!

        if (maximising) {
            //If we are the maximising player (white)
            let value = -Infinity;
            let move;

            for ( let { move: m, additional } of legalMoves ) {
                g.Move( m.from, m.to, m.special, additional );
                let ev = miniMax(g, depth - 1, !maximising, army)[0]
                if (value < ev) {
                    value = ev;
                    move = { move : m, additional };
                }
                g.UnMove()
            }

            return [ value, move ] as [ number, PromotionMove ];

        }

        else {
            //We are the minimising player (black)
            let value = Infinity;
            let move;

            for ( let { move: m, additional }  of legalMoves ) {
                g.Move( m.from, m.to, m.special, additional );
                let ev = miniMax(g, depth - 1, !maximising, army)[0]
                if (value > ev) {
                    value = ev
                    move =  { move : m, additional };
                }
                g.UnMove()
            }

            return [ value, move ] as [ number, PromotionMove ];
        }

    }

}

export default miniMax;