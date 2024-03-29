///
/// BOARD GENERATION FUNCTIONS
///

//An Empty Board
import Piece from "../Classes/Piece";
import {Army} from "../Presets/Armies";

const generateTestBoard : () => number[] = () => {

    let board = generateEmptyBoard();

    // board[1] = -Piece.King
    // board[10] = -Piece.Pawn
    // board[17] = -Piece.Pawn
    // board[41] = Piece.Pawn
    // board[47] = Piece.Pawn
    // board[48] = Piece.Pawn
    // board[51] = -Piece.Knight
    // board[56] = Piece.King
    // board[61] = Piece.Bede
    // board[30] = -Piece.Waffle
    // board[13] = -Piece.Warbishop
    // board[10] = Piece.Cardinal

    board[36] = Piece.Cardinal

    return board;
}

const generateEmptyBoard : () => number[] = () => {
    let board = [];
    for ( let i = 0; i <= 63; i++ ) {
        board.push(0); //Fills the board with 0s
    }
    return board;
}

//The Standard FIDE Board
const generateFIDEBoard : () => number[] = () => {
    let board = generateEmptyBoard();

    //Add the pawns
    for (let i = 8; i <= 15; i++) {
        board[i] = Piece.Pawn;
        board[63 - i] = -Piece.Pawn;
    }

    //Rooks
    board[0] = Piece.Rook;
    board[7] = Piece.Rook;
    board[56] = -Piece.Rook;
    board[63] = -Piece.Rook;

    //Knights
    board[1] = Piece.Knight;
    board[6] = Piece.Knight;
    board[57] = -Piece.Knight;
    board[62] = -Piece.Knight;

    //Bishops
    board[2] = Piece.Bishop;
    board[5] = Piece.Bishop;
    board[58] = -Piece.Bishop;
    board[61] = -Piece.Bishop;

    //Queens
    board[3] = Piece.Queen;
    board[59] = -Piece.Queen;

    //Kings
    board[4] = Piece.King;
    board[60] = -Piece.King;

    return board;

}

// GENERATE BOARD FROM TWO ARMIES
const generateBoardFromArmies: ( wArmy: Army, bArmy: Army ) => number[] = ( whiteArmy, blackArmy ) => {
    let board = generateEmptyBoard();
    whiteArmy.pieces.map( //White army
        ( piece, index ) => board[index] = piece
    )
    blackArmy.pieces.map( //Black army
        ( piece, index ) => board[56 + index] = piece * -1
    )
    //Add the pawns
    for (let i = 8; i <= 15; i++) {
        board[i] = Piece.Pawn;
        board[63 - i] = -Piece.Pawn;
    }
    return board;
}

export {
    generateEmptyBoard,
    generateFIDEBoard,
    generateTestBoard,
    generateBoardFromArmies
}