import React, {CSSProperties, useEffect, useLayoutEffect, useRef, useState} from 'react';
import ChessSquare from "../ChessSquare/ChessSquare";
import "./ChessBoard.css"
import ChessPiece from "../ChessPiece/ChessPiece";
import Piece from "../../Classes/Piece";
import Game from "../../Classes/Game";
import TargetingSquare from "../TargetingSquare/TargetingSquare";
import GamePiece from "../../Pieces/GamePiece";
import InfoBar from "../InfoBar/InfoBar";
import {materialEvaluation} from "../../helpers/Evaluation";
import ActualMove from "../../Classes/Move";
import {SpecialMove} from "../../types";
import {filterCardMoves, filterLegalMoves} from "../../helpers/Checks";
import PiecePromotionUI from "../PiecePromotionUI/PiecePromotionUI";
import { generateEmptyBoard } from '../../helpers/BoardGenerators';
import Expendable_Card from "../../Cards/FIDE/Expendable_Card";
import CardMove from '../../Classes/CardMove';
import {getActualMoves} from "../../helpers/MoveFilter";
import Card from "../../Cards/Card";
import ALL_CARDS from "../../Cards/Cards";
import InformationBubble from "../InformationBubble/InformationBubble";
import {Deck} from "../../Presets/Decks";

interface Props {
    board : number[], //The game board
    currentTurn : number, //The current player's turn, +1 or -1
    game: Game,
    move : ( from : number, to : number, special? : SpecialMove, additional? : object ) => void, //Move callback
    unMove : () => void, //UnMove callback
    moves : (ActualMove | CardMove)[], //Move history
    whiteCaptured : number[], //Pieces white has captured
    blackCaptured : number[], //Pieces black has captured
    capturePiece : ( p:number ) => void, //Capture piece callback
    whiteArmy: number[], //White's starting army
    blackArmy: number[], //Black's starting army
    playerColour : number, //"Player 1"'s player colour
    opponent: "COMP" | "LOCAL" | "ONLINE",
    gameUUID: string, //game UUID
    moveLockout: boolean, //Whether or not moves are currently locked out - for ensuring smooth transitions between turns
    allowRotation: boolean,
    setAllowRotation: ( allowRotation: boolean ) => void, //Call this whenever rotation is changed here, so app.tsx can know about it
    cardTargetingIndex: number | null, //The function to get card targets
    playCard: ( card: string, target: number ) => void,
    cardTargetsRemaining: number,
    currentTargets: number[]
}

export default function ChessBoard({ board, currentTurn, game, move, unMove, moves, whiteCaptured, blackCaptured, capturePiece,
       whiteArmy, blackArmy, playerColour, opponent, gameUUID, moveLockout, allowRotation, setAllowRotation,
       cardTargetingIndex, playCard, cardTargetsRemaining, currentTargets } : Props) {

    ///
    /// BOARD ROTATING
    ///
    const rotated = ( (playerColour === -1 && opponent !== "LOCAL") || ( currentTurn === -1 && opponent === "LOCAL" ) ) && gameUUID !== "dev-playground" && allowRotation;

    const [DEV_MODE_ENABLED] = useState(gameUUID === "dev-playground");

    ///
    /// MOVING & CAPTURING
    ///

    //THIS HANDLES MOVING
    const onDrop = ( ev : React.DragEvent, destination : number, special?: SpecialMove ) => {
        let [ piece, position ] = JSON.parse( ev.dataTransfer.getData("text/plain") ) as [number, number];
        moveHandler( piece, position, destination, special );
    }

    const moveHandler = ( piece:number, position: number, destination: number, special?: SpecialMove ) => {
        if ( Math.abs(piece) === Piece.Pawn && Piece.getRank( destination ) === ( piece > 0 ? 7 : 0 ) ) {
            setPromotion([ position, destination ]);
            let captured = special === "EP" ? board[destination - 8] : board[destination];
            if ( captured !== Piece.None ) capturePiece( captured );
            return;
        }

        let captured = special === "EP" ? board[destination - 8] : board[destination];

        move( position, destination, special );
        setTargeting([0, 0]);
    }

    const onDropCard = ( ev : React.DragEvent, target : number ) => {
        if (ev.dataTransfer) {
            let cardId = ev.dataTransfer.getData("text/plain");
            playCard( cardId, target );
        }
    }

    //Click playing card
    const onClickCard = ( target: number ) => {
        if (cardTargetingIndex !== null) {
            let card = game.getCurrentPlayerHand()[cardTargetingIndex];
            playCard(card.id, target);
        }
    }

    ///
    /// PROMOTING
    ///
    const onPromotion = ( pieceFrom : number, pieceTo : number, positionFrom : number, positionTo : number ) => {

        move( positionFrom, positionTo, "PROMOTION", { promotionTo: pieceTo }  );
        setPromotion([ -1, -1 ])

    }


    ///
    /// GENERATING UI ELEMENTS
    ///

    const getSquares = () => board.map( (piece, pos) => {
        let pMoves = moves.filter(m => m instanceof ActualMove) as ActualMove[];
        let ongoingEffects = game.getCurrentOngoingEffects();
        let affectedSquares = ongoingEffects.reduce((prev, e) => prev.indexOf(e.getSquare()) === -1 ? [...prev, e.getSquare()] : prev,[] as number[])
        return <ChessSquare position={pos} rotated={rotated} moveCircle={false} border={ affectedSquares.indexOf(pos) !== -1 }
                            highlight={ pMoves.length >= 1 && ( pos === pMoves[pMoves.length - 1].to || pos === pMoves[pMoves.length - 1].from )  } />
    })

    const getPieceKey = ( piece : number, pos : number ) => {
        //We will return simply the piece and its position
        //UNLESS it has been moved
        //WE LOOK THROUGH THE MOVES TO FIND IT'S LAST MOVE
        let startingPos = pos;
        let firstSeen = 1
        if ( moves.length > 0 ) {
            let inverseMoves = [...moves].reverse();
            //GO THROUGH EACH MOVE, AND TRACK THE POSITION OF THIS PIECE
            let found = false; // This is set to true if we've found when the piece was 'created' (e.g if it was created via promotion or by a card)
            startingPos = inverseMoves.reduce( ( p, m, i ) => {
                if (found) return p;
                firstSeen = inverseMoves.length - i
                // p is the current position of the piece
                if ( m instanceof ActualMove ) {
                    // If there was a promotion move to the last known location, then this was where the piece was created!
                    if (m.to === p && m.special === "PROMOTION" && m.additional.promotionTo === piece) found = true
                    // If there's nothing funny going on, we track the piece to its previous move
                    return (m.to === p && m.moving === piece) && !found ? m.from : p
                }
                else  {
                    // If the move was a card move, then we use the TrackPiece function.
                    // By default, this returns the position.
                    return ALL_CARDS[m.cardName].trackPiece(p, m.targets);
                }
            } , pos );


            if ( Math.abs( piece ) === Piece.Rook || Math.abs( piece ) === Piece.Bede ) { //If a rook, we also want to retain it for castling
                startingPos = inverseMoves.reduce(
                    ( p, m, i ) => {
                        if (m instanceof ActualMove) {
                            let regularMove = ( m.to === p && m.moving === piece );
                            let castle = ( m.special === "CASTLE" && ( m.to === p + 1 || m.to === p - 1 ) );
                            if ( regularMove ) return m.from
                            else if (castle && Math.abs(piece) === Piece.Bede) return m.to === p + 1 ? m.to + 1 : m.to - 1;
                            else if ( castle ) return m.to === p + 1 ? m.to + 1 : m.to - 2;
                            else return p
                        }
                        else return p
                    }, pos
                );
            }

        }

        return `${ startingPos }-${ piece }-${ firstSeen }`
    }

    const getPieces = () => board.map( ( piece, pos ) => piece === 0 ? null :
        <ChessPiece position={ pos }
                    key={ getPieceKey( piece, pos ) }
                    piece={ piece }
                    id={ getPieceKey( piece, pos ) }
                    draggable={ (((currentTurn > 0 && piece > 0 && (playerColour > 0 || opponent === "LOCAL")) || ( currentTurn < 0 && piece < 0 && (playerColour < 0 || opponent === "LOCAL") )) && !moveLockout) || DEV_MODE_ENABLED }
                    clickable={ (((currentTurn > 0 && piece > 0 && (playerColour > 0 || opponent === "LOCAL")) || ( currentTurn < 0 && piece < 0 && (playerColour < 0 || opponent === "LOCAL") )) && !moveLockout) || DEV_MODE_ENABLED }
                    target={ source => target([ piece, pos ], source)  }
                    unTarget={ source => target([ 0, -1 ], source) }
                    onHover={ () => setHoveringPos(pos) }
                    onUnHover={ () => setHoveringPos(-1) }
                    onRightClick={ id => showPieceInfo( pos, id ) }
                    active={ targeting[1] === pos || targeting[1] === -1 }
                    rotated={rotated} /> )

    const getTargetingSquares = () => {
        if ( cardTargetingIndex === null ) return Piece.getPiece(targeting[0]) ?
            filterLegalMoves(
                (Piece.getPiece(targeting[0]) as GamePiece).getLegalMoves(targeting[1], board, "all", targeting[0] > 0 ? 1 : -1, (moves.filter(m => m instanceof ActualMove) as ActualMove[])),
                board, (moves.filter(m => m instanceof ActualMove) as ActualMove[]), targeting[0] > 0 ? 1 : -1, game.getCurrentOngoingEffects()
            )
                .map(move =>
                    <TargetingSquare
                        position={move.to}
                        isCapture={board[move.to] !== Piece.None || move.special === "EP"}
                        isMove={board[move.to] === Piece.None}
                        onClick={ () => moveHandler( targeting[0], move.from, move.to, move.special ) }
                        onDrop={ev => onDrop(ev, move.to, move.special)}
                        rotated={rotated}
                    />
                )
            : null;
        else {
            let currentCard = game.getCurrentPlayerHand()[cardTargetingIndex];
            let index = cardTargetsRemaining === 0 ? 0 : currentCard.targets - cardTargetsRemaining;
            let currentFunction = currentCard.getValidTargets[ index ];
            currentFunction = currentFunction as typeof currentFunction || currentCard.getValidTargets[0];
            return currentFunction as unknown ?  currentFunction( board, currentTurn, getActualMoves(moves), currentTargets, game.getCurrentOngoingEffects() )
                .filter( square => filterCardMoves( game, currentCard.id, [ ...currentTargets, square ], currentTurn ) )
                    .map( target =>
                        <TargetingSquare
                            position={target}
                            isCapture={false}
                            isMove={true}
                            onClick={ () => onClickCard( target ) }
                            onDrop={ ev => onDropCard(ev, target) }
                            rotated={rotated}
                        />
                    ) : null
        }
    }

    const getMoveCircles = () => {
        let squares: JSX.Element[] = [];
        let hoveringSquares = hoveringPos === -1 ? [] as JSX.Element[] : Piece.getPiece(board[hoveringPos])?.getLegalMoves(
            hoveringPos, generateEmptyBoard(), "all", board[hoveringPos] > 0 ? 1 : -1, (moves.filter(m => m instanceof ActualMove) as ActualMove[])
        ).filter(move => move.to !== move.from).map(
            legalMove => <ChessSquare position={legalMove.to} rotated={rotated} moveCircle={true} highlight={false}/>
        );
        if (hoveringSquares) squares.push(...hoveringSquares);
        if (hoveringPos !== targeting[1] && Piece.getPiece(targeting[0])) squares.push(
            ...filterLegalMoves(
                (Piece.getPiece(targeting[0]) as GamePiece).getLegalMoves(targeting[1], board, "all", targeting[0] > 0 ? 1 : -1, (moves.filter(m => m instanceof ActualMove) as ActualMove[])),
                board, (moves.filter(m => m instanceof ActualMove) as ActualMove[]), targeting[0] > 0 ? 1 : -1, game.getCurrentOngoingEffects()
            ).map(
                legalMove => <ChessSquare position={legalMove.to} rotated={rotated} moveCircle={true} highlight={false}/>
            )
        )
        return squares;
    }


    ///
    /// TARGETING
    ///
    // [ piece, position from ]
    const [ targeting, setTargeting ] = useState<[ number, number ]>([ 0, -1 ]);
    type TargetingType = "piece-click" | "piece-drag" | "card-drag" | "card-click";
    const [ targetingType, setTargetingType ] = useState<TargetingType>("piece-click");

    const target = ( target: [number, number], type: TargetingType ) => {
        setTargeting(target);
        setTargetingType(type);
    }

    useLayoutEffect(() => {
        if (cardTargetingIndex !== null) setTargetingType("card-drag")
    }, [cardTargetingIndex])

    // The position that is currently being hovered
    const [ hoveringPos, setHoveringPos ] = useState<number>(-1);


    ///
    /// PROMOTING
    ///
    // Will be -1 when not shown
    const [ [ promotionFrom, promotionTo ], setPromotion ] = useState<[ number, number ]>([ -1, -1 ]);

    const getValidPromotionPieces = ( colour: -1 | 1 ) => {
        let pieces = colour > 0 ? whiteArmy : blackArmy;
        console.log(colour)
        //We want to remove duplicates
        let filtered = pieces.filter(p => Math.abs(p) !== Piece.King)
            .reduce(( acc, cur ) => acc.indexOf( cur ) === -1 ? [ ...acc, cur ] : acc, [] as number[]);
        //Also remove the king
        return filtered.filter(p => Math.abs(p) !== Piece.King).sort( (a, b) => a - b ).map( piece => colour > 0 ? piece : -piece )
    }

    ///
    /// PIECE INFO BUBBLE
    ///

    const [ pieceInfoPos, setPieceInfoPos ] = useState<number>(-1);
    const [ pieceInfoId, setPieceInfoId ] = useState<string>("");

    const showPieceInfo = ( pos: number, id: string ) => {
        setPieceInfoPos(pos);
        setPieceInfoId(id)
        window.addEventListener("click", infoListener);
        window.addEventListener("dragstart", infoListener)
    }

    const infoListener = ( e : MouseEvent | DragEvent ) => {
        let bubble = document.getElementById("PieceInfoBubble");
        if ( bubble ) { //There was a click, and the bubble exists!
            let { x, y, width, height } = bubble.getBoundingClientRect(); //Where is the bubble?
            //Check to see if the click was outside of the rect
            if ( e.pageX < x || e.pageX > x + width || e.pageY < y || e.pageY > y + height ) {
                ///The click was outside the bubble!
                setPieceInfoPos(-1);
                window.removeEventListener("click", infoListener);
            }
        }
    }

    const pieceInfoBubble = () => {

        if ( pieceInfoPos === -1 ) return null;
        let pieceNum = board[pieceInfoPos]
        let piece = Piece.getPiece(pieceNum)
        if (!piece) return null;

        const bubbleStyle = {
            position: "absolute"
        } as CSSProperties

        return <>

            <div id="PieceInfoBubble" style={ bubbleStyle }>

                <div onContextMenu={e => e.preventDefault()} onMouseDown={() => setPieceInfoPos(-1)} className="exit">
                    ✖
                </div>

                <h3 id="PieceInfoPieceTitle">{ piece.longName }</h3>
                <div className="imgRow">
                    <img src={ Piece.getImage(pieceNum) } />
                </div>
                <div className="pieceDescBlock moves">
                    { piece.movesDescription }
                </div>
                <div className="pieceDescBlock moves">
                    { piece.specialMoves.map((category, i) => <div className="move">{category}</div>) }
                </div>
                <div className="pieceDescBlock notes">
                    { piece.notes }
                </div>
                <div className="pieceDescBlock effects">
                    { game.getCurrentOngoingEffects().filter(e => e.getSquare() === pieceInfoPos).map((e, i) =>
                        <p>{ e.getToolTip() } { e.getDurationRemaining() } turn{e.getDurationRemaining() === 1 ? "" : "s"} remaining.</p> ) }
                </div>
                <div className="pieceDescBlock tags">
                    Tags: { piece.categories.map((category, i) =>
                    <span className="tag">{category}{i !== (piece as GamePiece).categories.length - 1 ? ", " : ""}</span>) }
                </div>
            </div>
        </>

    }

    // HANDLES POSITION OF PIECE INFO POPUP
    useLayoutEffect(() => {
        //We're gonna resize the element!
        let pieceEl = document.getElementById(pieceInfoId);
        let infoBubble = document.getElementById("PieceInfoBubble");
        if (infoBubble && pieceEl) {
            //That means we've just re-rendered the popup!
            let { x: pieceX, y: pieceY, height: pieceHeight, width: pieceWidth } = pieceEl.getBoundingClientRect();
            let { height: bubbleHeight, width: bubbleWidth } = infoBubble.getBoundingClientRect();

            let topMin = 10; //min top is 0
            if (window.visualViewport && window.window.visualViewport) {
                let topMax = window.window.visualViewport.height - bubbleHeight / 2 //effectively touching the bottom
                //Align centre with centre of piece - pieceX + pieceHeight/2 = top + bubbleHeight/2
                let idealTop = pieceY + ( pieceHeight / 2 ) - ( bubbleHeight / 2 );
                let boundedTop = Math.min( topMax, Math.max( topMin, idealTop ) );
                infoBubble.style.top = `${boundedTop}px`


                let leftSide = pieceX + 20 < window.innerWidth / 2

                let distMin = 0, distMax = window.innerHeight - ( bubbleWidth / 2 );
                let idealDist = leftSide ? pieceX - bubbleWidth - 10 : window.visualViewport.width - pieceX - pieceWidth - bubbleWidth -10
                let bounded = Math.min( distMax, Math.max( distMin, idealDist ) );

                if ( leftSide) {
                    infoBubble.style.left = `${bounded}px`;
                    infoBubble.style.right = "";
                }
                else {
                    infoBubble.style.right = `${bounded}px`
                    infoBubble.style.left = "";
                }
            }

        }

    }, [ pieceInfoId, pieceInfoPos ]);


    ///
    /// CHAOS VALUE
    ///

    const getChaosValue = () => blackCaptured.reduce((prev, current) => prev + (Piece.getPiece(current)?.materialValue || 0), 0) +
        whiteCaptured.reduce((prev, current) => prev + (Piece.getPiece(current)?.materialValue || 0), 0)


    ///
    /// DECKS
    ///
    const [ deckShown, setDeckShown ] = useState<"white"|"black">("white");
    const [ showDeckOverlay, setShowDeckOverlay ] = useState<boolean>(false);

    const getDeckQuantity = ( deck: Deck, cardId: string ) => deck.cards.filter(c => c === cardId).length

    const getDeckOverlay = () => {
        let deck = deckShown === "white" ? game.getWhiteDeck() : game.getBlackDeck();
        return <div id="DeckOverlay" className={showDeckOverlay ? "shown" : "hidden"}>
            <div className="close" onClick={() => setShowDeckOverlay(false)}>x</div>
            {
                [...deck.cards].filter((c, i, a) => a.indexOf(c) === i).map( card => ALL_CARDS[card] )
                    .map(card => <div className="deckOverlayCard">
                    <div className="topRow">
                        <p className="chaosCost">{ card.cost }</p>
                        <p className="speed">{ card.fast ? "fast" : "" }</p>
                    </div>
                    <p className="title">{card.cardName}</p>
                    <p className="desc">{card.description}</p>
                    <p className="expac">{card.expac}</p>
                    <p className="quantity">x{ getDeckQuantity( deck, card.id ) }</p>
                </div>
            )
            }
        </div>
    }

    return <>
        <InfoBar captures={ rotated? whiteCaptured : blackCaptured } evaluation={ -materialEvaluation( board ) * (rotated ? -1 : 1) }/>
        <div id="ChessBoardWrapper">
            <div id="ChessBoardOuter">

                <div id="ChessBoardSquares" className="board">
                    { getSquares() }
                </div>

                {
                  targeting[0] !== 0 || cardTargetingIndex !== null ? <div id="ChessBoardTargeting" className="board" onMouseDown={() => target([0, -1], targetingType)}>
                      { getTargetingSquares() }
                  </div> : null
                }

                <div id="ChessBoardPieces" className={`board ${ targeting[0] !== 0 ? `targeting ${ targetingType } ${ targeting[0] > 0 ? "whitemove" : "blackmove" }` : "" } ${ cardTargetingIndex === null ? "" : "card-targeting" }`}>
                    { getPieces() }
                </div>

                <div id="ChessBoardMoveCircles" className="board">
                    { getMoveCircles() }
                </div>

                {
                    promotionFrom !== -1 ? <PiecePromotionUI above={Piece.getRank( promotionTo ) === 7}
                            positionFrom={promotionFrom}
                            positionTo={promotionTo}
                            validPieces={ getValidPromotionPieces( board[promotionFrom] > 0 ? 1 : -1 ) }
                            promoting={promotionFrom > 0 ? board[promotionFrom] : Piece.None}
                            callback={onPromotion}
                            rotated={ rotated }
                    /> : null
                }

            </div>

            <div id="ChaosValue" title="Chaos Value - the material value of all pieces captured. Must meet a threshold before cards can be played.">
                <div className="val" id="ChaosValueScore">
                    { game.getChaosScore() }
                </div>
                <div className="sub">
                    CHAOS VALUE
                </div>
            </div>

            <div id="BlackDeck" title="Click to see cards" className="deck" onClick={() => {
                setDeckShown(!rotated ? "black" : "white");
                setShowDeckOverlay(true);
            }}>
                <p>{ !rotated ? "Black" : "White" } Deck</p>
                <p>{ (!rotated ? game.getBlackCurrentDeck() : game.getWhiteCurrentDeck()).length } card/s remaining</p>
            </div>
            <div id="WhiteDeck" title="Click to see cards" className="deck" onClick={() => {
                setDeckShown(!rotated ? "white" : "black");
                setShowDeckOverlay(true);
            }}>
                <p>{ !rotated ? "White" : "Black" } Deck</p>
                <p>{ (!rotated ? game.getWhiteCurrentDeck() : game.getBlackCurrentDeck()).length} card/s remaining </p>
            </div>

            <div id="HandNotice">
                <p className="hand">Opponent has { !rotated ? game.getBlackHand().length : game.getWhiteHand().length } card/s in hand</p>
            </div>

            {
                getDeckOverlay()
            }

        </div>
        <InfoBar captures={ rotated? blackCaptured : whiteCaptured } evaluation={ materialEvaluation( board ) * (rotated ? -1 : 1) }/>

        { pieceInfoBubble() }

        <div className="allowRotationCheckbox">
            <input type="checkbox" checked={ allowRotation } onChange={e => setAllowRotation( e.target.checked )} />
            <label>Allow rotation?</label>
        </div>
    </>

}