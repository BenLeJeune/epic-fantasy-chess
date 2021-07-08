import Board from "../Classes/Board";
import ActualMove from "../Classes/Move";
import Game from "../Classes/Game";
import {SpecialMove} from "../types";
import {filterLegalMoves} from "../helpers/Checks";
import {positionalEngineEvaluation} from "../helpers/Evaluation";

/// FIRST STAGE - COMPLETELY RANDOM

// Gets a random element from a list
const randomFromList = <T>( list : T[] ) => list[Math.floor((Math.random()*list.length))]

type moveProxy = {
    from: number, to: number, moving: number, captured: number, specify: number, special: SpecialMove | undefined
}

const moveGenerator = ( board: number[], history: moveProxy[], options: {} = {}  ) => {

    //CREATE OUR NEW GAME
    let g = new Game(
        board,
        history.map( m => new ActualMove( m.from, m.to, m.moving, m.captured, m.specify, m.special )  ),
    )

    let randomMoves =  Board.getLegalMoves( g.getBoard(), g.getMoves(), options );

    let legalMoves = filterLegalMoves( randomMoves, g.getBoard(), g.getMoves(), -1 )

    if ( legalMoves.length === 0 ) return;

    //Evaluate all the legal moves
    let orderedMoves = legalMoves.map( move => {
        g.Move( move.from, move.to, move.special );
        let evaluation = positionalEngineEvaluation( g.getBoard() );
        if ( move.special === "CASTLE" ) evaluation -= 50;
        g.UnMove();
        return { move, ev: evaluation }
    } ).sort(( prev, next ) => - next.ev + prev.ev);

    orderedMoves.map(m => console.log(m.move, m.ev  ))

    return orderedMoves[0].move;

}

export default moveGenerator