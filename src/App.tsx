import React, {useEffect, useRef, useState} from 'react';
import ChessBoard from "./components/ChessBoard/ChessBoard";
import Game, {AdditionalOptions} from "./Classes/Game";
import MovesDisplay from "./components/MovesDisplay/MovesDisplay";
import ActualMove from "./Classes/Move";
import {SpecialMove} from "./types";
import {isCheck} from "./helpers/Checks";
import {generateTestBoard} from "./helpers/BoardGenerators";

//The main component
function App() {

  const game = useRef( new Game() )

  //The Game
  const [ board, setBoard ] = useState<number[]>( game.current.getBoard() );
  const [ currentTurn, setCurrentTurn ] = useState<number>( game.current.getCurrentTurn() );
  const [ moves, setMoves ] = useState<ActualMove[]>( game.current.getMoves() );

  //Captures
  const [ whiteCaptured, setWhiteCaptured ] = useState<number[]>([]);
  const [ blackCaptured, setBlackCaptured ] = useState<number[]>([]);
  const capturePiece = ( p : number ) => {
    if ( p > 0 ) setBlackCaptured( prev => [...prev, p] ); //If a white piece was captured, add to black's captures
    else if ( p < 0 ) setWhiteCaptured( prev => [...prev, p] ); //If black piece, add to white's captures
  }

  const move = ( from : number, to : number, special?: SpecialMove, additional:  Partial<AdditionalOptions> = {} ) => {
    let col = game.current.getBoard()[from] > 0 ? 1 : -1;
    game.current.Move( from, to, special, additional );

    console.log( isCheck( game.current.getBoard(), game.current.getMoves(), col ) )

    setBoard( [...game.current.getBoard()] );
    setMoves( [...game.current.getMoves()] );
  }

  const unMove = () => {
    let lastMove = game.current.getLastMove();
    if ( !lastMove ) return;
    game.current.UnMove();
    setBoard( [...game.current.getBoard()] );
    setMoves( [...game.current.getMoves()] );
    if ( whiteCaptured.length > 0 && lastMove.captured === whiteCaptured[whiteCaptured.length - 1] ) {
      //If white captured a piece, un-capture it!
      setWhiteCaptured( prev => prev.slice(0, prev.length - 1)  );
    }
    else if ( blackCaptured.length > 0 && lastMove.captured === blackCaptured[blackCaptured.length - 1] ) {
      //If black captured a piece, un-capture it!
      setBlackCaptured( prev => prev.slice(0, prev.length - 1)  );
    }
  }

  return <div className="app">
    <div className="boardLeftColumn">

    </div>
    <div className="chessBoardColumn">
      <ChessBoard board={ board } currentTurn={ currentTurn } move={ move } unMove={ unMove } moves={moves}
                  whiteCaptured={ whiteCaptured } blackCaptured={ blackCaptured } capturePiece={ capturePiece }
      />
    </div>
    <div className="boardRightColumn">
      <MovesDisplay moves={ moves } unMove={ unMove }/>
    </div>
  </div>

}

export default App;
