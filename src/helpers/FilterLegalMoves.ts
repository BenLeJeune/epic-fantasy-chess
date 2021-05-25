import ActualMove from "../Classes/Move";
import {legalMove} from "../types";

///
/// FILTERING FOR LEGAL MOVES
///

const filterLegalMoves = ( board : number[], moveHistory : ActualMove[], moves : legalMove[] ) => {

   //This filters pseudo-legal moves for actually legal moves
   //There are two stages for this - special moves, and checks.
    moves.filter( ({ from, to, special }) => {

        //First, check for special moves

        //Second, check for... checks!

    } )

}