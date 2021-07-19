import Board from "../Classes/Board";
import ActualMove from "../Classes/Move";
import Game, {AdditionalOptions} from "../Classes/Game";
import {legalMove, SpecialMove} from "../types";
import {filterLegalMoves} from "../helpers/Checks";
import {positionalEngineEvaluation} from "../helpers/Evaluation";
import Piece from "../Classes/Piece";
import miniMax from "./MiniMax";
import queryOpeningBook from "./QueryOpeningBook";
import TranspositionTable from "./HashTable";

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
    const DEPTH = 3;

    if (opening) {
        return opening;
    }

    console.log("Generating...")

    console.time(`MiniMax with depth ${ DEPTH }`)

    let nodes = 0;
    let counter = () => nodes++

    let move = miniMax( g, DEPTH, false, army, b => table.get(b), (b, e) => table.set(b, e), counter );

    console.log(`Found a move with value ${move[0]}: ${JSON.stringify(move[1])}`)
    console.log(`Examined ${ nodes } nodes`)
    console.log(table);

    console.timeEnd(`MiniMax with depth ${ DEPTH }`);

    return move[1];

}

export default moveGenerator