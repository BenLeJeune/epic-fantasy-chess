///
/// BOARD GENERATION FUNCTIONS
///

//An Empty Board
import Piece from "../Classes/Piece";

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

export {
    generateEmptyBoard,
    generateFIDEBoard
}