///
/// MOVES
///

import Piece from "../Classes/Piece";
import {differentColours} from "./DifferentColours";
import {legalMove} from "../types";

const getLegalSingleMoves : ( board : number[], position : number, piece : number, callbacks: ((p : number) => number)[], mode : "all" | "moves" | "captures" ) => legalMove[]
= ( b, pos, p, cb, m ) =>  getLegalRiderMoves( b, pos, p, cb, m, 1 )

const getLegalRiderMoves: ( board : number[], position : number, piece : number, callbacks : (( p : number ) => number)[], mode : "all" | "moves" | "captures", depth? : number) => legalMove[]
    = ( board, position, piece, callbacks, mode, depth = 8 ) => {

    //We take an array of callbacks to check for
    //Start with an empty array
    let moves = [] as legalMove[]

    //For each supplied callback
    for ( let cb of callbacks ) {

        //Get the first move in the riding sequence
        let nextSquare = cb(position);
        let obstructed = false;
        let iterations = 0;
        //While the riding is unobstructed
        while ( !obstructed && nextSquare <= 63 && nextSquare >= 0 && iterations < depth ) {

            //If the square is empty
            if ( board[nextSquare] === Piece.None ) {
                if ( mode !== "captures" ) moves.push({ from : position, to : nextSquare }) //Push, unless we only want captures.
            }
            //If the square isn't empty
            else {
                //If it's an opposing piece, don't push if we're only after captures
                if ( differentColours( piece, board[nextSquare] ) ) {
                    if ( mode !== "moves" ) {
                        moves.push({from: position, to: nextSquare})
                    } //Push, unless we only want moves
                    obstructed = true;
                }
                //If it's a friendly piece,
                else {
                    obstructed = true;
                }
            }
            //If we haven't been obstructed yet, get the next square
            if ( !obstructed ) {
                if ( nextSquare === cb(nextSquare) ) obstructed = true;
                nextSquare = cb(nextSquare);
                iterations++;
            }
        }

    }

    return moves;

}

export {
    getLegalRiderMoves,
    getLegalSingleMoves
}