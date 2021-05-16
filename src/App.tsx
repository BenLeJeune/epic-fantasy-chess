import React, { useEffect } from 'react';
import Game from './Classes/Game';
import Pawn from "./Pieces/FIDE/Pawn";
import ChessBoard from "./components/ChessBoard/ChessBoard";

//The main component
function App() {

  return <div className="app">
    <div className="chessBoardColumn">
      <ChessBoard/>
    </div>
  </div>

}

export default App;
