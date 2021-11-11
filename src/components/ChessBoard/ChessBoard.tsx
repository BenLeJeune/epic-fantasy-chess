import React, {CSSProperties, useEffect, useLayoutEffect, useState} from 'react';
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
import {filterLegalMoves} from "../../helpers/Checks";
import PiecePromotionUI from "../PiecePromotionUI/PiecePromotionUI";
import { generateEmptyBoard } from '../../helpers/BoardGenerators';

interface Props {
    board : number[], //The game board
    currentTurn : number, //The current player's turn, +1 or -1
    move : ( from : number, to : number, special? : SpecialMove, additional? : object ) => void, //Move callback
    unMove : () => void, //UnMove callback
    moves : ActualMove[], //Move history
    whiteCaptured : number[], //Pieces white has captured
    blackCaptured : number[], //Pieces black has captured
    capturePiece : ( p:number ) => void, //Capture piece callback
    whiteArmy: number[], //White's starting army
    blackArmy: number[], //Black's starting army
    playerColour : number, //"Player 1"'s player colour
    opponentActive : boolean, //true for computer opponent, false for local opponent
    gameUUID: string, //game UUID
    pieceIndexes: number[]
}

export default function ChessBoard({ board, currentTurn, move, unMove, moves, whiteCaptured, blackCaptured, capturePiece, whiteArmy, blackArmy, playerColour, opponentActive, gameUUID, pieceIndexes } : Props) {

    //Whether or not the board needs to be rotated
    const rotated = ( (playerColour === -1 && opponentActive) || ( currentTurn === -1 && !opponentActive ) ) && gameUUID !== "dev-playground";

    const [DEV_MODE_ENABLED] = useState(gameUUID === "dev-playground");

    ///
    /// MOVING & CAPTURING
    ///

    //THIS HANDLES MOVING
    const onDrop = ( ev : React.DragEvent, destination : number, special?: SpecialMove ) => {
        let [ piece, position ] = JSON.parse( ev.dataTransfer.getData("text/plain") ) as [number, number];

        if ( Math.abs(piece) === Piece.Pawn && Piece.getRank( destination ) === ( piece > 0 ? 7 : 0 ) ) {
            setPromotion([ position, destination ]);
            let captured = special === "EP" ? board[destination - 8] : board[destination];
            if ( captured !== Piece.None ) capturePiece( captured );
            return;
        }

        let captured = special === "EP" ? board[destination - 8] : board[destination];

        move( position, destination, special );
        setTargeting([0, 0])
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

    const getSquares = () => board.map( (piece, pos) => <ChessSquare position={pos} rotated={rotated} moveCircle={false}
                                         highlight={ moves.length >= 1 && ( pos === moves[moves.length - 1].to || pos === moves[moves.length - 1].from ) /*pieceIndexes.indexOf(pos) !== -1*/  } /> )

    const getPieceKey = ( piece : number, pos : number ) => {
        //We will return simply the piece and its position
        //UNLESS it has been moved
        //WE LOOK THROUGH THE MOVES TO FIND IT'S LAST MOVE
        let startingPos = pos;
        if ( moves.length > 0 ) {
            let inverseMoves = [...moves].reverse();
            //GO THROUGH EACH MOVE, AND TRACK THE POSITION OF THIS PIECE
            startingPos = inverseMoves.reduce( ( p, m ) => m.to === p && m.moving === piece ? m.from : p , pos );

            if ( Math.abs( piece ) === Piece.Rook || Math.abs( piece ) === Piece.Bede ) { //If a rook, we also want to retain it for castling
                startingPos = inverseMoves.reduce(
                    ( p, m ) => {
                        let regularMove = ( m.to === p && m.moving === piece );
                        let castle = ( m.special === "CASTLE" && ( m.to === p + 1 || m.to === p - 1 ) );
                        if ( regularMove ) return m.from
                        else if (castle && Math.abs(piece) === Piece.Bede) return m.to === p + 1 ? m.to + 1 : m.to - 1;
                        else if ( castle ) return m.to === p + 1 ? m.to + 1 : m.to - 2;
                        else return p
                    }, pos
                );
            }

        }

        return `${ startingPos }-${ piece }`
    }

    const getPieces = () => board.map( ( piece, pos ) => piece === 0 ? null :
        <ChessPiece position={ pos }
                    key={ getPieceKey( piece, pos ) }
                    piece={ piece }
                    id={ getPieceKey( piece, pos ) }
                    draggable={ (currentTurn > 0 && piece > 0 && (playerColour > 0|| !opponentActive)) || ( currentTurn < 0 && piece < 0 && (playerColour < 0 || !opponentActive) ) || DEV_MODE_ENABLED }
                    target={ () => setTargeting([ piece, pos ])  }
                    unTarget={ () => setTargeting([ 0, -1 ]) }
                    onHover={ () => setHoveringPos(pos) }
                    onUnHover={ () => setHoveringPos(-1) }
                    onRightClick={ id => showPieceInfo( pos, id ) }
                    active={ targeting[1] === pos || targeting[1] === -1 }
                    rotated={rotated} /> )

    const getTargetingSquares = () => Piece.getPiece( targeting[0] ) ?
        filterLegalMoves(
            (Piece.getPiece( targeting[0] ) as GamePiece).getLegalMoves( targeting[1], board, "all", targeting[0] > 0 ? 1 : -1, moves ),
            board, moves, targeting[0] > 0 ? 1 : -1
        )
            .map( move =>
                <TargetingSquare
                    position={ move.to }
                    isCapture={ board[move.to] !== Piece.None || move.special === "EP"}
                    isMove={ board[ move.to ] === Piece.None }
                    onDrop={ ev => onDrop( ev, move.to, move.special ) }
                    rotated={rotated}
                />
            )
        : null;

    const getMoveCircles = () => hoveringPos === -1 ? null : Piece.getPiece( board[hoveringPos] )?.getLegalMoves(
        hoveringPos, generateEmptyBoard(), "all", board[hoveringPos] > 0 ? 1 : -1, moves
    ).map(
        legalMove => <ChessSquare position={legalMove.to} rotated={rotated} moveCircle={true} highlight={false}/>
    )


    ///
    /// TARGETING
    ///
    // [ piece, position from ]
    const [ targeting, setTargeting ] = useState<[ number, number ]>([ 0, -1 ]);

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
        if ( bubble ) {
            let { x, y, width, height } = bubble.getBoundingClientRect();
            //Check to see if the click was outside of the rect
            if ( e.pageX < x || e.pageX > x + width || e.pageY < y || e.pageY > y + height ) {
                ///The click was outside the rect!
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
                <div className="pieceDescBlock tags">
                    Tags: { piece.categories.map((category, i) =>
                    <span className="tag">{category}{i !== (piece as GamePiece).categories.length - 1 ? ", " : ""}</span>) }
                </div>
            </div>
        </>

    }

    useLayoutEffect(() => {
        //We're gonna resize the element!
        let pieceEl = document.getElementById(pieceInfoId);
        let infoBubble = document.getElementById("PieceInfoBubble");
        if (infoBubble && pieceEl) {
            //That means we've just re-rendered the popul!
            let { x: pieceX, y: pieceY, height: pieceHeight, width: pieceWidth } = pieceEl.getBoundingClientRect();
            let { height: bubbleHeight, width: bubbleWidth } = infoBubble.getBoundingClientRect();

            let topMin = 10; //min top is 0
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

    }, [ pieceInfoId, pieceInfoPos ])

    return <>
        <InfoBar captures={ blackCaptured } evaluation={ -materialEvaluation( board ) }/>
        <div id="ChessBoardWrapper">
            <div id="ChessBoardOuter">

                <div id="ChessBoardSquares" className="board">
                    { getSquares() }
                </div>

                {
                  targeting[0] !== 0 ? <div id="ChessBoardTargeting" className="board">
                      { getTargetingSquares() }
                  </div> : null
                }

                <div id="ChessBoardPieces" className={`board ${ targeting[0] !== 0 ? "targeting" : "" }`}>
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
        </div>
        <InfoBar captures={ whiteCaptured } evaluation={ materialEvaluation( board ) }/>

        { pieceInfoBubble() }
    </>

}