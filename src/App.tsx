import React, { useEffect } from 'react';
import Game from './Classes/Game';
import Pawn from "./Pieces/FIDE/Pawn";
import ChessBoard from "./components/ChessBoard/ChessBoard";

//The main component
function App() {

  useEffect(() => {

    let game = new Game(); //Starting a new game

    let board = game.getBoard();

    //We want to add a new pawn to the square a1.
    let square = board.getSquare("a", 1);
    let pawn = new Pawn(square);
    square.setPiece(pawn);

    console.log(board.getSquares());


  }, []);

  return <div className="app">
    <ChessBoard/>
  </div>

}

export default App;
