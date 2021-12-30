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
import * as Comlink from 'comlink';

import {useParams} from "react-router-dom";
import {GAME_KEY} from "./KEYS";
import {Army, FIDEARMY} from "./Presets/Armies";
import PlayableCard from "./components/PlayableCard/PlayableCard";
import Expendable_Card from "./Cards/FIDE/Expendable_Card";
import CardMove from './Classes/CardMove';
import { getActualMoves } from './helpers/MoveFilter';
import Card from "./Cards/Card";
import {Deck, FIDEDECK} from "./Presets/Decks";
import NavBar from "./components/NavBar/NavBar";


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
  const [{ colour : playerColour, opponent, army, opponentArmy, deck, opponentDeck } ] = useState(() => {
    const rawGamesData = localStorage.getItem(GAME_KEY) || "{}";
    const parsedGamesData = JSON.parse(rawGamesData) as { [uuid : string]: GameInfo };
    const thisGame = parsedGamesData[uuid];
    try {
      thisGame.army = JSON.parse(thisGame.army);
      thisGame.opponentArmy = JSON.parse(thisGame.opponentArmy);
      thisGame.deck = JSON.parse(thisGame.deck);
      thisGame.opponentDeck = JSON.parse(thisGame.opponentDeck);
    }
    catch (e) {
      console.log(e)
    }
    return thisGame as GameInfo & { army : Army, opponentArmy : Army, deck: Deck, opponentDeck: Deck } || {
      colour: 1,
      opponent: uuid === "fiesta" ? "COMP" : "LOCAL",
      army: FIDEARMY,
      opponentArmy: FIDEARMY,
      deck: FIDEDECK,
      opponentDecl: FIDEARMY
    }
  })

  ///
  /// USED FOR DEVELOPMENT PURPOSES
  ///
  // const [ opponent ] = useState(false); //THIS DISABLES THE AI AND LETS YOU MOVE BOTH COLOUR PIECES


  const game = useRef( playerColour > 0 ? new Game(generateBoardFromArmies(army, opponentArmy), undefined, deck, opponentDeck) :
                        new Game(generateBoardFromArmies(opponentArmy, army), undefined, opponentDeck, deck));
  /// THE OPPONENT

  const worker = useRef<any>()

  useLayoutEffect(() => {

    const _worker = new Worker('./WebWorker', { name: 'opponent-webworker', type: 'module' });
    const workerApi = Comlink.wrap<import('./WebWorker').opponentWebWorker>(_worker);

    worker.current = workerApi;

    console.log("Creating worker!");
  }, [])

  //The Game
  const [ board, setBoard ] = useState<number[]>( game.current.getBoard() );
  const [ currentTurn, setCurrentTurn ] = useState<number>( game.current.getCurrentTurn() );
  const [ moves, setMoves ] = useState<(ActualMove|CardMove)[]>( game.current.getMoves() );

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
    const { beginBackgroundEvaluation } = worker.current;

    let gMoves = game.current.getMoves();
    let gBoard = game.current.getBoard();

    let parsedMoves = getActualMoves(gMoves).map(
        ({ from, to, moving, captured, special, specify }) => {
          return {
            from, to, moving, captured, special, specify
          } })

    beginBackgroundEvaluation( [...gBoard], parsedMoves, opponentArmy.pieces, { colour: -1 } )

  }

  const endBackgroundEvaluation = async () => {

    const { endBackgroundEvaluation } = worker.current;

    endBackgroundEvaluation()

  }

  const generateRandomMove = async ( col:number = -playerColour ) => {
    // const { MoveGenerator } = wrap<import("./WebWorker/worker").OpponentWebWorker>(worker.current)
    const { moveGenerator } = worker.current;

    let gMoves = game.current.getMoves();
    let gBoard = game.current.getBoard();

    let parsedMoves = getActualMoves(gMoves).map(
        ({ from, to, moving, captured, special, specify }) => {
          return {
              from, to, moving, captured, special, specify
        } });

    let parsedEffects = game.current.getCurrentOngoingEffects().map(effect => {
      return {
        square: effect.getSquare(), name: effect.getName(), target: effect.getTarget(), duration: effect.getDurationRemaining()
      }
    })

    let hand = playerColour > 0 ? game.current.getBlackHand() : game.current.getWhiteHand();
    let parsedHand = hand.map(card => card.id)

    return await moveGenerator( [...gBoard], parsedMoves, opponentArmy.pieces, col, parsedEffects, parsedHand, { colour: col })
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
    let gEffects = game.current.getCurrentOngoingEffects();

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
      let pawnMoves = getActualMoves(recentMoves).filter(m => Math.abs( m.moving ) === Piece.Pawn );
      let captures = getActualMoves(recentMoves).filter(m => m.captured !== 0 );
      if ( pawnMoves.length === 0 && captures.length === 0 ) {
        setGameOver(true);
        setWinner(0);
        setGameOverMsg(FIFTYMOVE)
      }
    }

    let moves = Board.getLegalMoves( gBoard, getActualMoves(gMoves), { colour: -col } );
    let legalMoves = filterLegalMoves( moves, gBoard, getActualMoves(gMoves), -col, gEffects )
    if ( legalMoves.length === 0 ) {
      ///THERE ARE NO LEGAL MOVES!
      //The game is now over
      setGameOver(true);
      if ( isCheck( gBoard, getActualMoves(gMoves), -col ) ) {
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


    /// CHECK TO SEE IF THE GAME IS OVER
    isGameOver( from, col );

    setMoves( [...game.current.getMoves()] );
    setBoard( [...game.current.getBoard()] );

    //Set the timer for the next turn to begin
    //If we aren't rotating, then there is no reason for there to be any delay
    if ( !allowRotation ) {
      setCurrentTurn( game.current.getCurrentTurn() )
    }
    else {
      //We're rotating.
      setMoveLockout(true);
      setTimeout(() => {
        //After a delay, change the turn, and allow moves once again.
        setCurrentTurn(game.current.getCurrentTurn())
        setMoveLockout(false);
      }, 500);
    }


    //IF NOT, THE OPPONENT PLAYS A MOVE
    setTimeout(() => {
      if ( !gameOver
          && ( game.current.getCurrentTurn() === -playerColour || uuid === "fiesta")
          && opponent === "COMP" ) {
        generateRandomMove( game.current.getCurrentTurn() )
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
  /// MOVE LOCKOUT WITH ROTATION
  /// + For smooth rotation between turns, moves must be temporarily locked out
  ///
  const [ moveLockout, setMoveLockout ] = useState<boolean>(false);
  const [ allowRotation, setAllowRotation ] = useState<boolean>(true);

  ///
  /// OPPONENT MAKING THE FIRST MOVE
  ///
  useEffect(() => {

    if ( opponent === "COMP" && playerColour === -1 ) {
      //We're playing as black against a computer - computer must make the first move!
      console.log("Generating opening move");
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
    if ( lastMove instanceof ActualMove ) {
      if ( whiteCaptured.length > 0 && lastMove.captured === whiteCaptured[whiteCaptured.length - 1] ) {
        //If white captured a piece, un-capture it!
        setWhiteCaptured( prev => prev.slice(0, prev.length - 1)  );
      }
      else if ( blackCaptured.length > 0 && lastMove.captured === blackCaptured[blackCaptured.length - 1] ) {
        //If black captured a piece, un-capture it!
        setBlackCaptured( prev => prev.slice(0, prev.length - 1)  );
      }
    }
  }

  ///
  /// CARD TARGETING
  ///
  const [ cardTargetingIndex, setCardTargetingIndex ] = useState<number|null>(null);
  const [ cardTargetsRemaining, setCardTargetsRemaining ] = useState<number>(0);
  const [ cardTargets, setCardTargets ] = useState<number[]>([] as number[]);

  const dragStartCallback = ( index : number ) => {
    setCardTargetingIndex( index );
    setCardTargets([]);
    console.log(`Card drag started on ${ index }, card ${ game.current.getCurrentPlayerHand()[index].cardName }`);

    //make the user's hand lower
    let hand = document.getElementById("PlayerHand");
    if (hand) hand.className = "forceLower";
  };

  const onDragEnd = () => {
    console.log(`Drag ended, ${ cardTargetsRemaining } remaining`);
    endTargeting();
  }

  const appendCardTarget = ( card: string, target: number ) => {
    let targetsRemaining = cardTargetsRemaining, targets = cardTargets;
    if ( cardTargetsRemaining <= 0 && cardTargetingIndex !== null ) targetsRemaining = game.current.getCurrentPlayerHand()[cardTargetingIndex].targets; //Initialises if not set
    //We want to decrement the number of targets left
    targetsRemaining--;
    console.log(`APPEND CARD TARGET - ${ targetsRemaining } remaining of ${ game.current.getCurrentPlayerHand()[cardTargetingIndex || 0].targets }`)
    //Push this target to the array of targets
    targets.push(target);
    setCardTargetsRemaining(targetsRemaining);
    setCardTargets(targets);
    if ( targetsRemaining === 0 ) {
      playCard(card, targets);
      endTargeting(targetsRemaining);
    }
  }

  const endTargeting = ( targetsRemaining = cardTargetsRemaining ) => {
    console.log(`Ending targeting with ${ targetsRemaining } remaining`)
    if (targetsRemaining === 0) setCardTargetingIndex(null);
    //make the user's hand lower
    let hand = document.getElementById("PlayerHand");
    if (hand) hand.className = "";
  }

  const playCard = ( card: string, targets: number []) => {

    //Gets the card from the hand
    let playedCard = currentTurn > 0 ? game.current.getWhiteHand()[cardTargetingIndex||0] : game.current.getBlackHand()[cardTargetingIndex||0];


    //Play the card
    game.current.PlayCard( playedCard, targets );

    setMoves(game.current.getMoves());
    setBoard(game.current.getBoard());

    //Handles turn switching
    if (game.current.getCurrentTurn() !== currentTurn) {
      //Set the timer for the next turn to begin
      //If we aren't rotating, then there is no reason for there to be any delay
      if ( !allowRotation ) {
        setCurrentTurn( game.current.getCurrentTurn() )
      }
      else {
        //We're rotating.
        setMoveLockout(true);
        setTimeout(() => {
          //After a delay, change the turn, and allow moves once again.
          setCurrentTurn(game.current.getCurrentTurn())
          setMoveLockout(false);
        }, 500);
      }
    }
  }

  ///
  /// CHAOS VALUE
  ///
  const getChaosValue = () => blackCaptured.reduce((prev, current) => prev + (Piece.getPiece(current)?.materialValue || 0), 0) +
      whiteCaptured.reduce((prev, current) => prev + (Piece.getPiece(current)?.materialValue || 0), 0);

  ///
  /// HAND DISPLAY
  ///
  const getHandCards = () => {
    const handSize = currentTurn > 0 ? game.current.getWhiteHand().length : game.current.getBlackHand().length;
    const cardMapping = ( card : Card, i : number ) =>
        <PlayableCard draggable={!moveLockout && getChaosValue() >= card.cost && !isCheck( board, getActualMoves(moves), currentTurn )} card={card}
                      dragStartCallback={() => dragStartCallback(i)}
                      dragEndCallback={onDragEnd} handPosition={i + 1} handSize={handSize}/>
    return currentTurn > 0 ? game.current.getWhiteHand().map(cardMapping) : game.current.getBlackHand().map(cardMapping)
  }



  return <div className="app paddedTop">


    <div className="boardLeftColumn">
    </div>
    <div className={`chessBoardColumn ${ gameOver ? "gameOver" : "playing" }`}>
      <ChessBoard board={ board } currentTurn={ currentTurn } move={ move } unMove={ unMove } moves={moves}
                  whiteCaptured={ whiteCaptured } blackCaptured={ blackCaptured } capturePiece={ capturePiece }
                  whiteArmy={ playerColour > 0 ? army.pieces : opponentArmy.pieces } blackArmy={ playerColour < 0 ? army.pieces : opponentArmy.pieces }
                  playerColour={ playerColour } cardTargetingIndex={cardTargetingIndex} game={game.current}
                  opponentActive={ opponent === "COMP"} gameUUID={ uuid }
                  allowRotation={allowRotation} setAllowRotation={ v => setAllowRotation(v) } moveLockout={moveLockout}
                  playCard={appendCardTarget} cardTargetsRemaining={cardTargetsRemaining} currentTargets={cardTargets}
      />
    </div>
    <div className="boardRightColumn">
      <p className="playerToMove">{ game.current.getCurrentTurn() > 0 ? "White" : "Black" } to move</p>
      <MovesDisplay moves={ moves } unMove={ unMove } canUndo={ opponent === "LOCAL" }/>
    </div>
    <div id="PlayerHand">
      <div id="PlayerHandInner">
        {
          getHandCards()
        }
      </div>
    </div>


    <NavBar/>


    { gameOver ?  <GameOverUI message={gameOverMsg} winner={winner}/> : null}

  </div>

}


export default App;
