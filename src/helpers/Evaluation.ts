import Board from "../Classes/Board";
import {BLACK, WHITE} from "../constants/consts";

const materialEvaluation : ( board : Board ) => number = board => {
    //We simply want to add up the numbers on each side.
    let sum = 0;
    let whitePieces = board.getPieces().filter( p => p.getColour() === WHITE );
    let blackPieces = board.getPieces().filter( p => p.getColour() === BLACK );

    //Add up the white pieces
    sum += whitePieces.reduce(( prev, next ) => prev + next.getMaterialValue(), 0);
    console.log(whitePieces, sum)
    sum -= blackPieces.reduce(( prev, next ) => prev + next.getMaterialValue(), 0);
    console.log(blackPieces, sum)

    return sum;
}

export {
    materialEvaluation
}
