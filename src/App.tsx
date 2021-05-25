import React, {useEffect, useRef, useState} from 'react';
import ChessBoard from "./components/ChessBoard/ChessBoard";
import Game from "./Classes/Game";
import MovesDisplay from "./components/MovesDisplay/MovesDisplay";
import ActualMove from "./Classes/Move";
import {SpecialMove} from "./types";

//The main component
function App() {

  const game = useRef( new Game() )

  const [ board, setBoard ] = useState<number[]>( game.current.getBoard() );
  const [ currentTurn, setCurrentTurn ] = useState<number>( game.current.getCurrentTurn() );
  const [ moves, setMoves ] = useState<ActualMove[]>( game.current.getMoves() );


  const move = ( from : number, to : number, special?: SpecialMove  ) => {
    if (special) console.log(special);
    game.current.Move( from, to, special );
    setBoard( [...game.current.getBoard()] );
    setMoves( [...game.current.getMoves()] );
  }

  const unMove = () => {
    game.current.UnMove();
    setBoard( [...game.current.getBoard()] );
    setMoves( [...game.current.getMoves()] );
  }

  return <div className="app">
    <div className="boardLeftColumn">

    </div>
    <div className="chessBoardColumn">
      <ChessBoard board={ board } currentTurn={ currentTurn } move={ move } unMove={ unMove } moves={moves} />
    </div>
    <div className="boardRightColumn">
      <MovesDisplay moves={ moves } unMove={ unMove }/>
    </div>
  </div>

}

export default App;
