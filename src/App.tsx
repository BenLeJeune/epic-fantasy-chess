import React, {useContext, useEffect, useLayoutEffect, useRef, useState} from 'react';
import ChessBoard from "./components/ChessBoard/ChessBoard";
import Game, {AdditionalOptions} from "./Classes/Game";
import MovesDisplay from "./components/MovesDisplay/MovesDisplay";
import ActualMove from "./Classes/Move";
import {GameInfo, SpecialMove} from "./types";
import {filterLegalMoves, isCheck} from "./helpers/Checks";
import {generateBoardFromArmies} from "./helpers/BoardGenerators";
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
import CardMove from './Classes/CardMove';
import {getActualMoves} from './helpers/MoveFilter';
import Card from "./Cards/Card";
import {Deck, FIDEDECK} from "./Presets/Decks";
import NavBar from "./components/NavBar/NavBar";
import {sameColour} from "./helpers/DifferentColours";
import ConnectionContext from "./Context/ConnectionContext";
import Message, {CardMove_Message, PieceMove_Message} from "./Messages";
import ALL_CARDS from "./Cards/Cards";


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


  ///  THE REFERENCE FOR THE GAME
  const game = useRef( playerColour > 0 ? new Game(generateBoardFromArmies(army, opponentArmy), undefined, deck, opponentDeck) :
                        new Game(generateBoardFromArmies(opponentArmy, army), undefined, opponentDeck, deck));

  /// THE OPPONENT
  const worker = useRef<any>()

  useLayoutEffect(() => {
    // If we're against a computer opponent, creates the webworker
    if ( opponent === "COMP" ) {
      // Creates the WebWorker
      const _worker = new Worker('./WebWorker', { name: 'opponent-webworker', type: 'module' });
      worker.current = Comlink.wrap<import('./WebWorker').opponentWebWorker>(_worker);

      console.log("Creating worker!");
    }
    else {
      console.log("Not against a computer opponent")
    }
    //We also want to do this. Don't ask why, otherwise shit breaks.
    document.body.style.display = "none";
    setTimeout(() => {
      document.body.style.display = "unset";
    }, 0)
  }, [])

  //The Game
  const [ board, setBoard ] = useState<number[]>( game.current.getBoard() );
  const [ currentTurn, setCurrentTurn ] = useState<number>( game.current.getCurrentTurn() );
  const [ moves, setMoves ] = useState<(ActualMove|CardMove)[]>( game.current.getMoves() );

  //Ending the game
  const [ winner, setWinner ] = useState<number>(0); //1 for white win, -1 for black win, 0 for draw
  const [ gameOver, setGameOver ] = useState<boolean>(false);
  const [ gameOverMsg, setGameOverMsg ] = useState<string>(STALEMATE);

  // Plays an audio effect when the game ends
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
  /// ONLINE OPPONENT
  ///

  const {Channel, Conn} = useContext(ConnectionContext);

  useEffect(() => {
    if (opponent === "ONLINE" && Channel) {
      Channel.addEventListener("message", onMessage)
    }
  }, [Channel, Conn])

  const onMessage = (msgEvent:MessageEvent) => {
    let msg = JSON.parse(msgEvent.data) as Message;
    switch (msg.msgType) {
      case "piece_move":
        console.log("Made a piece move!\n", msg.payload);
        let {from, to, special} = (msg as PieceMove_Message).payload.move;
        try {
          move(from, to, special, msg.payload.additional )
        }
        catch (e) {
          console.log(e);
        }
        break;
      case "card_move":
        console.log("Made a card move!\n", msg.payload);
        let {id, targets} = (msg as CardMove_Message).payload;
        try {
          playCard(id, targets);
        }
        catch (e) {
          console.log(e);
        }
        break;
      default:
        break;
    }
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

  const isGameOver : ( col: number ) => void = ( col )  => {

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

    let col = game.current.getBoard()[from] > 0 ? 1 : -1; // The colour of the piece that was just moved
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
    isGameOver( col );

    setMoves( [...game.current.getMoves()] );
    setBoard( [...game.current.getBoard()] );

    // If we're playing online and WE just made a move, send it to the opponent
    if ( opponent === "ONLINE" && col === playerColour && Channel ) {
      let data = {
        move: { from, to, special },
        additional
      };
      let msg = new PieceMove_Message(data);
      Channel.send(JSON.stringify(msg));
    }


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
                    if (m.move) {
                      move(m.move.from, m.move.to, m.move.special, m.additional)
                    }
                    else if ( m.id && m.targets ) {
                      playCard( m.id, m.targets )
                    }
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
              beginBackgroundEvaluation().then(() => {});
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
    let playedCard;
    if (cardTargetingIndex) {
      playedCard = currentTurn > 0 ? game.current.getWhiteHand()[cardTargetingIndex||0] : game.current.getBlackHand()[cardTargetingIndex||0];
    }
    else {
      playedCard = game.current.getCurrentPlayerHand()[ game.current.getCurrentPlayerHand().map( c => c.id ).indexOf(card) ]
    }

    if (opponent === "ONLINE" && currentTurn !== playerColour) {
      playedCard = ALL_CARDS[card]; // We don't know what the opponent's hand is in this case, so get it from the IDs
      //Remove a card from the opponent's hand. Doesn't matter which, only used for tracking hand size.
      if (currentTurn > 0) game.current.setWhiteHand( hand => {
          return hand.filter((card, i) => i !== 0); //Removes the first card.
        })

      else game.current.setBlackHand( hand => {
          return hand.filter((card, i) => i !== 0); //Removes the first card.
        })
    }

    //Play the card
    let cardPlayerCol = currentTurn;
    game.current.PlayCard( playedCard, targets );
    let col = game.current.getCurrentTurn();


    /// CHECK TO SEE IF THE GAME IS OVER
    isGameOver( col );

    setMoves(game.current.getMoves());
    setBoard(game.current.getBoard());

    // If we're playing online and WE just played a card, send it to the opponent!
    console.log(opponent, col, playerColour, Channel);
    if ( opponent === "ONLINE" && Channel && cardPlayerCol === playerColour ) {
      let data = {
        id: card,
        targets
      };
      console.log("Sending a card message!")
      let msg = new CardMove_Message(data);
      Channel.send(JSON.stringify(msg))
    }

    console.log(game.current.getCurrentTurn(), currentTurn)
    setTimeout(() => {
      console.log(game.current.getCurrentTurn(), currentTurn)
    }, 1000)
    //Handles turn switching
    if (!playedCard.fast) {
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
    setTimeout(() => {
      if ( !gameOver
          && ( game.current.getCurrentTurn() === -playerColour || uuid === "fiesta")
          && opponent === "COMP" ) {
        generateRandomMove( game.current.getCurrentTurn() )
            .then(
                ( m ) => {
                  if (!gameOver && m) try {
                    if (m.move) {
                      move(m.move.from, m.move.to, m.move.special, m.additional)
                    }
                    else if ( m.id && m.targets ) {
                      playCard( m.id, m.targets )
                    }
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
    const hand = opponent === "LOCAL" ? ( currentTurn > 0 ? game.current.getWhiteHand() : game.current.getBlackHand()  ) : (playerColour > 0 ? game.current.getWhiteHand() : game.current.getBlackHand())
    const handSize = hand.length ;
    const cardMapping = ( card : Card, i : number ) =>
        <PlayableCard draggable={!moveLockout && getChaosValue() >= card.cost && !isCheck( board, getActualMoves(moves), currentTurn ) && ( opponent === "LOCAL" || sameColour(playerColour, currentTurn) )} card={card}
                      dragStartCallback={() => dragStartCallback(i)}
                      dragEndCallback={onDragEnd} handPosition={i + 1} handSize={handSize}/>
    return hand.map(cardMapping)
  }



  return <div className="app paddedTop">


    <div className="boardLeftColumn">
    </div>
    <div className={`chessBoardColumn ${ gameOver ? "gameOver" : "playing" }`}>
      <ChessBoard board={ board } currentTurn={ currentTurn } move={ move } unMove={ unMove } moves={moves}
                  whiteCaptured={ whiteCaptured } blackCaptured={ blackCaptured } capturePiece={ capturePiece }
                  whiteArmy={ playerColour > 0 ? army.pieces : opponentArmy.pieces } blackArmy={ playerColour < 0 ? army.pieces : opponentArmy.pieces }
                  playerColour={ playerColour } cardTargetingIndex={cardTargetingIndex} game={game.current}
                  opponent={opponent} gameUUID={ uuid }
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
