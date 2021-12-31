import ActualMove from "../Classes/Move";
import Game from "../Classes/Game";
import {SpecialMove} from "../types";
import {positionalEngineEvaluation} from "../helpers/Evaluation";
import Piece from "../Classes/Piece";
import miniMax, { cardMove } from "./MiniMax";
import queryOpeningBook from "./QueryOpeningBook";
import transpositionTable from "./HashTable";
import { getActualMoves } from "../helpers/MoveFilter";
import OngoingEffect from "../Classes/OngoingEffect";
import ALL_CARDS from "../Cards/Cards";
import {promotionMove} from "./IncludePromotions";

/// FIRST STAGE - COMPLETELY RANDOM

// Gets a random element from a list

export type moveProxy = {
    from: number, to: number, moving: number, captured: number, specify: number, special: SpecialMove | undefined
}

export type effectProxy = {
    square: number, name: string, target: "piece" | "square", duration: number
}

// type EvaluatedMove = {
//     move: legalMove,
//     ev: number,
//     additional?: Partial<AdditionalOptions>
// }

let table = new transpositionTable();

///
/// THE MAIN MOVE GENERATOR
///
const moveGenerator = ( board: number[], history: moveProxy[], army: number[], colour: number, effects : effectProxy[], hand: string[], options: {} = {}  ) => {

    console.log(colour)

    //CREATE OUR NEW GAME
    let g = new Game(
        [...board],
        history.map( m => new ActualMove( m.from, m.to, m.moving, m.captured, m.specify, m.special )  ),
    )

    if (g.getCurrentTurn() !== colour) g.dangerouslySetCurrentTurn(colour)

    effects.forEach(e => g.addOngoingEffect( new OngoingEffect( e.square, e.name, e.duration, "", e.target )  ))


    let g_moves_actual = getActualMoves(g.getMoves());

    let parsedHand = hand.map( id => ALL_CARDS[id] );

    //BEFORE WE SEARCH FOR ACTUAL MOVES, LET'S EXAMINE THE OPENING BOOK
    console.log("Choosing Opening...")

    if (history.length === 0 && colour >= 1) {
        //THIS IS OUR FIRST MOVE!
        let [ opening ] = queryOpeningBook( g, colour, true );
        if (opening) return opening;
    }

    let [opening, openingName] = queryOpeningBook( g, colour );
    const DEPTH = 2;

    if (opening) {
        console.log(`Opening: ${ openingName }`)
        return opening;
    }

    console.group(`GENERATING MOVE ${ g.getMoves().length + 1 }`)

    console.log("Generating...")

    console.time(`MiniMax with depth ${ DEPTH }`)

    let nodes = 0;
    let counter = () => nodes++

    let pieces = Piece.PIECE_OBJECTS;
    let move = miniMax( g, DEPTH, colour > 0, army, (b) => table.get(b), (b, e, t, q) => table.set(b, e, t, q), counter, undefined, undefined, undefined, pieces, parsedHand, colour );

    console.log(`Found a move with value ${move[0]}: ${JSON.stringify(move[1])}`)
    console.log(`Examined ${ nodes } nodes`)

    console.log(`Evaulation before move: ${ positionalEngineEvaluation( g.getBoard(), g_moves_actual ) }`)

    if ( (move[1] as promotionMove).move ) {
        let m = (move[1] as promotionMove).move
        g.Move(m.from, m.to, m.special, (m as any).additional);
    }
    else {
        //MOVE IS A CARD MOVE
        let card = move[1] as cardMove;
        let playableCard = ALL_CARDS[card.id];
        g.PlayCard( playableCard, card.targets );

    }


    console.log(`Evaulation after move: ${ positionalEngineEvaluation( g.getBoard(), g_moves_actual ) }`)

    g.UnMove();

    console.timeEnd(`MiniMax with depth ${ DEPTH }`);


    console.groupEnd();

    // g.Move(move[1].move.from, move[1].move.to, move[1].move.special, move[1].additional);
    //
    //
    //
    // let wKing = g.getBoard().indexOf( Piece.King );
    // let bKing = g.getBoard().indexOf( -Piece.King );
    //
    // let pos = -1 > 0 ? wKing : bKing;
    //
    // let lMove = Board.getLegalMoves(
    //     g.getBoard(), g.getMoves(), { colour: 1 } )
    //
    // console.log( g.getBoard(), g.getBoard().indexOf(Piece.Queen), new Queen().getLegalMoves( 33, g.getBoard(), "all", 1 ) )
    //
    // console.log(move)
    //
    // console.log(g.getLastMove())
    //
    // //Are there any attacks on the king?
    // console.log( lMove.filter(m => m.to === pos), wKing, bKing )
    //
    // g.UnMove()
    // console.log(g.getBoard())

    return move[1];

}


///
/// EVALUATING POSITIONS IN THE BACKGROUND
///

let backgroundEvaluating = false;
let backgroundCalculations = 0;

const beginBackgroundEvaluation = async ( board: number[], history: moveProxy[], army: number[], options: {} = {} ) => {

    let g = new Game(
        [...board],
        history.map( m => new ActualMove( m.from, m.to, m.moving, m.captured, m.specify, m.special )  ),
    )

    let opening = queryOpeningBook( g, -1 );
    if (opening) return;


    console.log("Background evaluation started - the AI is evaluating moves while you think about your turn.")

    //WE WANT TO START EVALUATING MOVES IN THE BACKGROUND
    backgroundCalculations = 0;
    backgroundEvaluating = true;

    const DEPTH = 0;
    let nodes = 0;
    const counter = () => nodes++;


    // let move = miniMax( g, DEPTH, false, army, (b) => table.get(b), (b, e, t, q) => table.set(b, e, t, q), counter );

    console.log(`Finished background calculations. Nodes evaluated during your turn: ${ nodes }`)

    if (backgroundEvaluating) console.log(`Analysed all moves`)

    //
    // const evaluate = ( n : number ) => new Promise<number>( resolve => {
    //     n++;
    //     if ( backgroundEvaluating ) setTimeout( () => {
    //         // console.log(`Done a 'calculation', now up to ${n}`)
    //         evaluate( n ).then( x => resolve(x) )
    //     }, 100 );
    //     else resolve(n)
    // } )
    //
    // evaluate( backgroundCalculations ).then( x => console.log(`Finished background calculations. Calculations performed during your turn: ${ x }`) )

}

const endBackgroundEvaluation = () => {
    console.log("Any background evaluations ended.")
    backgroundEvaluating = false;
}


export {
    moveGenerator,
    beginBackgroundEvaluation,
    endBackgroundEvaluation
}