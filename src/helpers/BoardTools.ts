import Square from "../Classes/Square";
import Board from "../Classes/Board";
import {FILES} from "../constants/consts";

///THIS DETERMINES IF THE PATH BETWEEN TWO SQUARES IS CLEAR
const isObstructed : ( sq1 : Square, sq2 : Square, board : Board ) => boolean
    = ( start, end, board ) => {

    let obstruction = false;

    //There are three possible cases

    //First, a horizontal path.
    if ( start.getRank() === end.getRank() ) {
        //We want to make sure there aren't any pieces between them
        let file1 = FILES.indexOf(start.getFile());
        let file2 = FILES.indexOf(end.getFile());
        let startFile = Math.min(file1, file2);
        let endFile = Math.max(file1, file2); //Simplifies the ordering
        for ( let f = startFile; f <= endFile; f++ ) {
            let square = board.getSquare( FILES[f], start.getRank() );
            if ( !square.isEmpty() && f !== file1 ) obstruction = true;
        }
        return obstruction
    }

    //Next, a vertical path
    if ( start.getFile() === end.getFile() ) {
        //Same as before
        let rank1 = start.getRank();
        let rank2 = end.getRank();
        let startRank = Math.min(rank1, rank2);
        let endRank = Math.max(rank1, rank2);
        for ( let rank = startRank; rank <= endRank; rank++ ) {
            let square = board.getSquare( start.getFile(), rank );
            if ( !square.isEmpty() && rank !== rank1) obstruction = true;
        }
        return obstruction;
    }


    //Finally, a horizontal path
    let rankDifference = start.getRank() - end.getRank();
    let fileDifference = FILES.indexOf(start.getFile()) - FILES.indexOf(end.getFile());

    if ( Math.abs(rankDifference) === Math.abs(fileDifference) ) {
        //We can do some mathematical trickery here
        //If the board is 8x8, then...
        let startNumber = start.getSquareNumber();
        let endNumber = end.getSquareNumber();
        if ( (startNumber - endNumber ) % 9 === 0 ) {
            //If going from bottom-left to top-right

            if ( fileDifference < 0 ) {
                //We're going up (left to right)
                for ( let x = 1; x <= Math.abs( rankDifference ); x++ ) {
                    let square = board.getSquare( FILES[ FILES.indexOf(start.getFile()) + x ], start.getRank() + x );
                    if ( !square.isEmpty() ) obstruction = true;
                }
            }
            else {
                //We're going down (right to left)
                for ( let x = -1; x >= -rankDifference; x-- ) {
                    let square = board.getSquare( FILES[ FILES.indexOf(start.getFile()) + x ], start.getRank() + x );
                    if ( !square.isEmpty() ) obstruction = true;
                }
            }
        }
        else {
            //Going from top-left to bottom-right
            if ( fileDifference < 0 ) {
                //We're going down (left to right)
                for ( let x = -1; x >= -rankDifference; x-- ) {
                    let square = board.getSquare( FILES[ FILES.indexOf(start.getFile()) - x ], start.getRank() + x );
                        if ( !square.isEmpty() ) obstruction = true;
                }
            }
            else {
                //We're going up (right to left)
                for ( let x = 1; x <= Math.abs( rankDifference ); x++ ) {
                    let square = board.getSquare( FILES[ FILES.indexOf(start.getFile()) - x ], start.getRank() + x );
                    if ( !square.isEmpty() ) obstruction = true;
                }
            }
        }

        return obstruction;

    }

    return true

}

//Recursively checking if the riding is obstructed
const isRidingObstructed : ( sq1 : Square, sq2 : Square, f : ( sq : Square ) => Square, depth : number ) => boolean
    = ( start, end, moveFunction, depth = 8 ) => {
    //Checking to see if the riding is obstructed

    //If we've reached the final square
    if ( depth === 0 ) return true;

    //First, let's find the next square
    let passingSquare = moveFunction( start );
    if (!passingSquare) return true;


    //If this is the final square, then there is nothing between.
    if ( passingSquare === end ) return !end.isEmpty();
    else {
        //If not, is the square empty?
        if ( passingSquare.isEmpty() ) {
            return isRidingObstructed( passingSquare, end, moveFunction, depth - 1 );
        }
        else {
            //If the square is full, there is an obstruction
            return true;
        }
    }
}

export {
    isObstructed,
    isRidingObstructed
}