import React, {useEffect, useState} from 'react';
import ChessBoard from "./components/ChessBoard/ChessBoard";
import Game from "./Classes/Game";

//The main component
function App() {

  const [ game, setGame ] = useState<Game>( new Game() );

  useEffect(() => {

  })

  return <div className="app">
    <div className="chessBoardColumn">
      <ChessBoard board={ game.getBoard() } currentTurn={ game.getCurrentTurn() } move={ game.Move } unMove={ game.UnMove } />
    </div>
  </div>

}

export default App;
