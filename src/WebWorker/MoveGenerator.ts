import Board from "../Classes/Board";
import ActualMove from "../Classes/Move";
import Game, {AdditionalOptions} from "../Classes/Game";
import {legalMove, SpecialMove} from "../types";
import {filterLegalMoves, isCheck} from "../helpers/Checks";
import {positionalEngineEvaluation} from "../helpers/Evaluation";
import Piece from "../Classes/Piece";
import miniMax from "./MiniMax";
import queryOpeningBook from "./QueryOpeningBook";
import TranspositionTable from "./HashTable";
import Queen from "../Pieces/FIDE/Queen";
import {randomFromList} from "../helpers/Utils";

/// FIRST STAGE - COMPLETELY RANDOM

// Gets a random element from a list

export type moveProxy = {
    from: number, to: number, moving: number, captured: number, specify: number, special: SpecialMove | undefined
}

type EvaluatedMove = {
    move: legalMove,
    ev: number,
    additional?: Partial<AdditionalOptions>
}

let table = new TranspositionTable();

///
/// THE MAIN MOVE GENERATOR
///
const moveGenerator = ( board: number[], history: moveProxy[], army: number[], colour: number, options: {} = {}  ) => {

    console.log(colour)

    //CREATE OUR NEW GAME
    let g = new Game(
        [...board],
        history.map( m => new ActualMove( m.from, m.to, m.moving, m.captured, m.specify, m.special )  ),
    )


    let randomMoves =  Board.getLegalMoves( g.getBoard(), g.getMoves(), options );

    let legalMoves = filterLegalMoves( randomMoves, g.getBoard(), g.getMoves(), colour )

    //if ( legalMoves.length === 0 ) return;

    //BEFORE WE SEARCH FOR ACTUAL MOVES, LET'S EXAMINE THE OPENING BOOK
    console.log("Choosing Opening...")

    if (history.length === 0) {
        //THIS IS OUR FIRST MOVE!
        let [ opening, openingName ] = queryOpeningBook( g, true );
        if (opening) return opening;
    }

    let [opening, openingName] = queryOpeningBook( g );
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

    let move = miniMax( g, DEPTH, colour > 0, army, (b) => table.get(b), (b, e, t, q) => table.set(b, e, t, q), counter );

    console.log(`Found a move with value ${move[0]}: ${JSON.stringify(move[1])}`)
    console.log(`Examined ${ nodes } nodes`)

    console.log(`Evaulation before move: ${ positionalEngineEvaluation( g.getBoard(), g.getMoves() ) }`)

    g.Move(move[1].move.from, move[1].move.to, move[1].move.special, move[1].additional);

    console.log(`Evaulation after move: ${ positionalEngineEvaluation( g.getBoard(), g.getMoves() ) }`)

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

    let opening = queryOpeningBook( g );
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