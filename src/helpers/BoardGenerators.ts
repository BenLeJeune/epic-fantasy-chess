import Board from "../Classes/Board";
import {BLACK, FILES} from "../constants/consts";
import Pawn from "../Pieces/FIDE/Pawn";
import Rook from "../Pieces/FIDE/Rook";
import Knight from "../Pieces/FIDE/Knight";
import Bishop from "../Pieces/FIDE/Bishop";
import Queen from "../Pieces/FIDE/Queen";

const GenerateFIDEBoard = () => {
    //First of all, the pawns.
    let board = new Board();
    for ( let file = 0; file <= 7; file++ ) {
        //Add a pawn on each file
        let lightSquare = board.getSquare(FILES[file], 2);
        let darkSquare = board.getSquare(FILES[file], 7);
        new Pawn(lightSquare);
        new Pawn(darkSquare, BLACK);
    }
    //Then rooks
    new Rook( board.getSquare("a", 1) );
    new Rook( board.getSquare("h", 1) );
    new Rook( board.getSquare("a", 8), BLACK );
    new Rook( board.getSquare("h", 8), BLACK );

    //Knights
    new Knight( board.getSquare("b", 1) );
    new Knight( board.getSquare("g", 1) );
    new Knight(board.getSquare("b", 8), BLACK);
    new Knight(board.getSquare("g", 8), BLACK);

    //Bishops
    new Bishop(board.getSquare("c", 1));
    new Bishop(board.getSquare("f", 1));
    new Bishop(board.getSquare("c", 8), BLACK);
    new Bishop(board.getSquare("f", 8), BLACK);

    //Queens
    new Queen(board.getSquare("d", 1));
    new Queen(board.getSquare("d", 8), BLACK);

    return board.getBoardState();
}

export {
    GenerateFIDEBoard
};