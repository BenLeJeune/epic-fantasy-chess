import Board from "../Classes/Board";
import ActualMove from "../Classes/Move";
import Game from "../Classes/Game";
import {SpecialMove} from "../types";
import {filterLegalMoves} from "../helpers/Checks";

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

    return randomFromList(legalMoves);

}

export default moveGenerator