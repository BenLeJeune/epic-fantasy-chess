import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import ChessBoard from "./components/ChessBoard/ChessBoard";
import Game, {AdditionalOptions} from "./Classes/Game";
import MovesDisplay from "./components/MovesDisplay/MovesDisplay";
import ActualMove from "./Classes/Move";
import {GameInfo, legalMove, Move, SpecialMove} from "./types";
import {filterLegalMoves, isCheck} from "./helpers/Checks";
import {generateBoardFromArmies, generateTestBoard} from "./helpers/BoardGenerators";
import Board from "./Classes/Board";
import GameOverUI from "./components/GameOverUI/GameOverUI";
import "./App.css"
import {areIdenticalMoves} from "./helpers/CompareMoves";
import Piece from "./Classes/Piece";

//Opponent Web Worker
import {Remote, wrap} from 'comlink';
import {
  beginBackgroundEvaluation,
  beginBackgroundEvaluation as BeginBackgroundEvaluation
} from "./WebWorker/MoveGenerator";
import {useParams} from "react-router-dom";
import {GAME_KEY} from "./KEYS";
import {Army, FIDEARMY} from "./Presets/Armies";


const CHECKMATE = "via Checkmate",
    STALEMATE = "via Stalemate",
    REPETITION = "via Move Repetition",
    FIFTYMOVE = "via the Fifty-move rule";

//The main component
function App() {

  ///
  /// GAME START DATA
  ///
  const { uuid } = useParams<{ uuid : string }>();
  const [{ colour : playerColour, opponent, army, opponentArmy } ] = useState(() => {
    const rawGamesData = localStorage.getItem(GAME_KEY) || "{}";
    const parsedGamesData = JSON.parse(rawGamesData) as { [uuid : string]: GameInfo };
    const thisGame = parsedGamesData[uuid];
    try {
      thisGame.army = JSON.parse(thisGame.army);
      thisGame.opponentArmy = JSON.parse(thisGame.opponentArmy);
    }
    catch (e) {
      console.log(e)
    }
    return thisGame as GameInfo & { army : Army, opponentArmy : Army } || {
      colour: 1,
      opponent: uuid === "fiesta" ? "COMP" : "LOCAL",
      army: FIDEARMY,
      opponentArmy: FIDEARMY,
    }
  })

  ///
  /// USED FOR DEVELOPMENT PURPOSES
  ///
  // const [ opponent ] = useState(false); //THIS DISABLES THE AI AND LETS YOU MOVE BOTH COLOUR PIECES


  const game = useRef( new Game( playerColour > 0 ? generateBoardFromArmies( army, opponentArmy ) : generateBoardFromArmies( opponentArmy, army ) ) );

  /// THE OPPONENT

  const worker = useRef<any>()
  useLayoutEffect(() => {
    worker.current = wrap<import("./WebWorker/worker").OpponentWebWorker>(new Worker("./WebWorker/worker", { name: "opponentWebWorker", type: "module" }));
    console.log("Creating worker!");
  }, [])

  //The Game
  const [ board, setBoard ] = useState<number[]>( game.current.getBoard() );
  const [ currentTurn, setCurrentTurn ] = useState<number>( game.current.getCurrentTurn() );
  const [ moves, setMoves ] = useState<ActualMove[]>( game.current.getMoves() );

  //Ending the game
  const [ winner, setWinner ] = useState<number>(0); //1 for white win, -1 for black win, 0 for draw
  const [ gameOver, setGameOver ] = useState<boolean>(false);
  const [ gameOverMsg, setGameOverMsg ] = useState<string>(STALEMATE);

  useEffect(() => {
    if (gameOver) {
      ///PLAYS AUDIO
      let audio = new Audio( "/assets/Sounds/8bit-game-over.mp3" );
      audio.play().then();
    }
  }, [gameOver])

  ///
  /// OPPONENT AI
  ///
  const beginBackgroundEvaluation = async () => {

    if (uuid === "fiesta") return;
    const { BeginBackgroundEvaluation } = worker.current;

    let gMoves = game.current.getMoves();
    let gBoard = game.current.getBoard();

    let parsedMoves = gMoves.map(
        ({ from, to, moving, captured, special, specify }) => {
          return {
            from, to, moving, captured, special, specify
          } })

    BeginBackgroundEvaluation( [...gBoard], parsedMoves, opponentArmy.pieces, { colour: -1 } )

  }

  const endBackgroundEvaluation = async () => {

    const { EndBackgroundEvaluation } = worker.current;

    EndBackgroundEvaluation()

  }

  const generateRandomMove = async ( col:number = -playerColour ) => {
    // const { MoveGenerator } = wrap<import("./WebWorker/worker").OpponentWebWorker>(worker.current)
    const { MoveGenerator } = worker.current;

    let gMoves = game.current.getMoves();
    let gBoard = game.current.getBoard();

    let parsedMoves = gMoves.map(
        ({ from, to, moving, captured, special, specify }) => {
          return {
              from, to, moving, captured, special, specify
        } })

    if ( uuid === "fiesta" ) col = currentTurn

    return await MoveGenerator( [...gBoard], parsedMoves, opponentArmy.pieces, { colour: col })
  }

  ///
  /// GAME STATE - CAPTURES, MOVES, GAME OVER
  ///
  const [ whiteCaptured, setWhiteCaptured ] = useState<number[]>([]);
  const [ blackCaptured, setBlackCaptured ] = useState<number[]>([]);
  const capturePiece = ( p : number ) => {
    if ( p > 0 ) setBlackCaptured( prev => [...prev, p] ); //If a white piece was captured, add to black's captures
    else if ( p < 0 ) setWhiteCaptured( prev => [...prev, p] ); //If black piece, add to white's captures
  }

  const isGameOver : ( from : number, col: number ) => void = ( from, col )  => {

    let gMoves = game.current.getMoves();
    let gBoard = game.current.getBoard();

    ///CHECK FOR THREEFOLD REPETITION
    if ( gMoves.length >= 12 ) {
      let recentMoves = gMoves.slice( gMoves.length - 12, gMoves.length );
      if ( areIdenticalMoves( recentMoves[0], recentMoves[4], recentMoves[8] ) ) {
        if ( areIdenticalMoves( recentMoves[1], recentMoves[5], recentMoves[9] ) ) {
          if (areIdenticalMoves( recentMoves[2], recentMoves[6], recentMoves[10] )) {
            if (areIdenticalMoves(recentMoves[3], recentMoves[7], recentMoves[11])) {
              //Threefold repetition baby lets go
              setGameOver(true);
              setWinner(0);
              setGameOverMsg(REPETITION);
            }
          }
        }
      }
    }

    /// CHECK FOR FIFTY-MOVE RULE
    if ( gMoves.length >= 100 ) {
      let recentMoves = gMoves.slice( gMoves.length - 100, gMoves.length );
      let pawnMoves = recentMoves.filter( m => Math.abs( m.moving ) === Piece.Pawn );
      let captures = recentMoves.filter( m => m.captured !== 0 );
      if ( pawnMoves.length === 0 && captures.length === 0 ) {
        setGameOver(true);
        setWinner(0);
        setGameOverMsg(FIFTYMOVE)
      }
    }

    let moves= Board.getLegalMoves( gBoard, gMoves, { colour: -col } );
    let legalMoves = filterLegalMoves( moves, gBoard, gMoves, -col )
    if ( legalMoves.length === 0 ) {
      ///THERE ARE NO LEGAL MOVES!
      //The game is now over
      setGameOver(true);
      if ( isCheck( gBoard, gMoves, -col ) ) {
        //Is in check - checkmate! Set a winner!
        setWinner( col > 0 ? 1 : -1 )
        setGameOverMsg( CHECKMATE );
      }
      else {
        //Not in check - it is a stalemate!
        setWinner(0);
        setGameOverMsg( STALEMATE ); //The game is now over
      }
    }

  }

  const move = ( from : number, to : number, special?: SpecialMove, additional:  Partial<AdditionalOptions> = {} ) => {
    //When we make our move, stop performing background calculations

    let col = game.current.getBoard()[from] > 0 ? 1 : -1;
    if ( col === playerColour ) endBackgroundEvaluation();

    ///PLAYS AUDIO
    let audio = new Audio( "/assets/Sounds/wooden-piece-move.mp3" );
    audio.play();


    let captured = special === "EP" ? game.current.getBoard()[to - (8 * col )] : game.current.getBoard()[to];

    if (captured !== Piece.None) {
      console.log(`CAPTURING A ${ captured }`)
      capturePiece(captured);
    }

    game.current.Move( from, to, special, additional );


    setMoves( [...game.current.getMoves()] );
    setBoard( [...game.current.getBoard()] );
    setCurrentTurn( game.current.getCurrentTurn() );

    /// CHECK TO SEE IF THE GAME IS OVER
    isGameOver( from, col );

    //IF NOT, THE OPPONENT PLAYS A MOVE
    setTimeout(() => {
      if ( !gameOver && ( game.current.getCurrentTurn() === -playerColour || uuid === "fiesta") && opponent === "COMP" ) {
        generateRandomMove( -game.current.getCurrentTurn() )
            .then(
                ( m ) => {
                  if (!gameOver && m) try {
                    move(m.move.from, m.move.to, m.move.special, m.additional)
                    beginBackgroundEvaluation()
                    //When we make this move, begin performing background calculations
                  }
                  catch (e) {
                    console.log(e);
                    console.log(m)
                  }
                }
            )
      }

    }, 0)
  };

  ///
  /// OPPONENT MAKING THE FIRST MOVE
  ///
  useEffect(() => {

    if ( opponent === "COMP" && playerColour === -1 ) {
      //We're playing as black against a computer - computer must make the first move!
      generateRandomMove()
        .then(
          m => {
            if (m) try {
              move( m.move.from, m.move.to, m.move.special, m.additional );
              beginBackgroundEvaluation();
            }
            catch (e) {
              console.log(e);
              console.log(m);
            }
          }
        )
    }

  }, [])

  const unMove = () => {
    let lastMove = game.current.getLastMove();
    if ( !lastMove ) return;
    game.current.UnMove();
    setBoard( [...game.current.getBoard()] );
    setMoves( [...game.current.getMoves()] );
    setCurrentTurn( game.current.getCurrentTurn() );
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
    <div className={`chessBoardColumn ${ gameOver ? "gameOver" : "playing" }`}>
      <ChessBoard board={ board } currentTurn={ currentTurn } move={ move } unMove={ unMove } moves={moves}
                  whiteCaptured={ whiteCaptured } blackCaptured={ blackCaptured } capturePiece={ capturePiece }
                  whiteArmy={ playerColour > 0 ? army.pieces : opponentArmy.pieces } blackArmy={ playerColour < 0 ? army.pieces : opponentArmy.pieces }
                  playerColour={ playerColour }
                  opponentActive={ opponent === "COMP"} gameUUID={ uuid }
      />
    </div>
    <div className="boardRightColumn">
      <p className="playerToMove">{ game.current.getCurrentTurn() > 0 ? "White" : "Black" } to move</p>
      <MovesDisplay moves={ moves } unMove={ unMove }/>
    </div>

    { gameOver ?  <GameOverUI message={gameOverMsg} winner={winner}/> : null}

  </div>

}


export default App;
