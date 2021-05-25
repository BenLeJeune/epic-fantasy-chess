import React, {useEffect, useRef, useState} from 'react';
import ChessBoard from "./components/ChessBoard/ChessBoard";
import Game from "./Classes/Game";
import MovesDisplay from "./components/MovesDisplay/MovesDisplay";

//The main component
function App() {

  const [ game, setGame ] = useState<Game>( new Game() );

  useEffect(() => {
    console.log("Updated!")
  }, [ game.getBoard(), game.getCurrentTurn(), game.Move, game.UnMove ])

  const move = ( from : number, to : number ) => setGame( g => {
    let newG = Object.assign( {}, g );
    newG.Move( from, to )
    return newG;
  } )

  return <div className="app">
    <div className="boardLeftColumn">

    </div>
    <div className="chessBoardColumn">
      <ChessBoard board={ game.getBoard() } currentTurn={ game.getCurrentTurn() } move={ move } unMove={ game.UnMove } />
    </div>
    <div className="boardRightColumn">
      <MovesDisplay moves={ game.getMoves() } unMove={ game.UnMove }/>
    </div>
  </div>

}

export default App;
