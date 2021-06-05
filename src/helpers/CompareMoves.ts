///
/// COMPARING MOVES
///

import ActualMove from "../Classes/Move";

const areIdenticalMoves = (...moves: ActualMove[] ) => {
    let first = moves[0]
    for ( let move of moves ) {
        //See if it's the same move
        if ( move.to !== first.to || move.from !== first.from || move.moving !== first.moving ||
             move.captured !== first.captured || move.special !== first.special ) return false;
    }

    return true;
}

export {
    areIdenticalMoves
}