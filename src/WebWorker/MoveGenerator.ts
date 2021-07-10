import Board from "../Classes/Board";
import ActualMove from "../Classes/Move";
import Game, {AdditionalOptions} from "../Classes/Game";
import {legalMove, SpecialMove} from "../types";
import {filterLegalMoves} from "../helpers/Checks";
import {positionalEngineEvaluation} from "../helpers/Evaluation";
import Piece from "../Classes/Piece";
import miniMax from "./MiniMax";
import queryOpeningBook from "./QueryOpeningBook";

/// FIRST STAGE - COMPLETELY RANDOM

// Gets a random element from a list
const randomFromList = <T>( list : T[] ) => list[Math.floor((Math.random()*list.length))]

type moveProxy = {
    from: number, to: number, moving: number, captured: number, specify: number, special: SpecialMove | undefined
}

type EvaluatedMove = {
    move: legalMove,
    ev: number,
    additional?: Partial<AdditionalOptions>
}

const moveGenerator = ( board: number[], history: moveProxy[], army: number[], options: {} = {}  ) => {

    //CREATE OUR NEW GAME
    let g = new Game(
        board,
        history.map( m => new ActualMove( m.from, m.to, m.moving, m.captured, m.specify, m.special )  ),
    )

    let randomMoves =  Board.getLegalMoves( g.getBoard(), g.getMoves(), options );

    let legalMoves = filterLegalMoves( randomMoves, g.getBoard(), g.getMoves(), -1 )

    if ( legalMoves.length === 0 ) return;

    //BEFORE WE SEARCH FOR ACTUAL MOVES, LET'S EXAMINE THE OPENING BOOK

    let opening = queryOpeningBook( g );

    if (opening) {
        return opening;
    }


    //Evaluate all the legal moves
    // let orderedMoves = legalMoves.map( move => {
    //     if ( g.getBoard()[ move.from ] === ( -1 ) * Piece.Pawn && ( move.to < 8 || move.to > 55 ) ) {
    //         //Promotions
    //         let promotions = [] as EvaluatedMove[]
    //         for ( let promotionTo of validPromotionPieces ) {
    //             g.Move( move.from, move.to, "PROMOTION", { promotionTo } );
    //             let evaluation = positionalEngineEvaluation( g.getBoard() );
    //             g.UnMove();
    //             promotions.push( { move: Object.assign( { special: "PROMOTION" }, move ), ev: evaluation, additional: { promotionTo } } )
    //         }
    //         return promotions;
    //     }
    //     else {
    //         //Everything else
    //         g.Move( move.from, move.to, move.special );
    //         let evaluation = positionalEngineEvaluation( g.getBoard() );
    //         if ( move.special === "CASTLE" ) evaluation -= 50;
    //         g.UnMove();
    //         return { move, ev: evaluation } as EvaluatedMove
    //     }
    // } ).reduce<EvaluatedMove[]>(
    //     ( acc, next ,) => {
    //         if ( Array.isArray(next) ) return [ ...acc, ...next ]
    //         else return [ ...acc, next ]
    //     }, [] as EvaluatedMove[]
    // ).sort(( prev, next ) => - next.ev + prev.ev);
    //
    // orderedMoves.map(m => console.log(m.move, m.ev))

    const DEPTH = 4;

    console.time(`MiniMax with depth ${ DEPTH }`)

    let move = miniMax( g, DEPTH, false, army )
    console.log(`Found a move with value ${move[0]}: ${JSON.stringify(move[1])}`)

    console.timeEnd(`MiniMax with depth ${ DEPTH }`);

    return move[1];

}

export default moveGenerator