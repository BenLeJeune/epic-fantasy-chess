import React, {useEffect, useState} from "react";
import ChessSquare from "../ChessSquare/ChessSquare";
import {BLACK, FILES, WHITE} from "../../constants/consts";
import "./ChessBoard.css";
import Game from "../../Classes/Game";
import Pawn from "../../Pieces/FIDE/Pawn";
import Rook from "../../Pieces/FIDE/Rook";
import ChessPiece from "../ChessPiece/ChessPiece";
import Knight from "../../Pieces/FIDE/Knight";
import Board from "../../Classes/Board";
import Piece from "../../Pieces/Piece";
import TargetingSquare from "../TargetingSquare/TargetingSquare";
import Square from "../../Classes/Square";
import {GenerateFIDEBoard} from "../../helpers/BoardGenerators";
import InfoBar from "../InfoBar/InfoBar";
import {materialEvaluation} from "../../helpers/Evaluation";

export default function ChessBoard() {

    /// ----------
    /// GAME STATE
    /// ----------
    const [ game, setGame ] = useState( new Game() ); //The game itself
    const updateGame = ( callback : ( g:Game ) => Game ) => {
        //Used for simplifying the setGame() process
        let newGame = callback( game );
        setGame( Object.assign( {}, newGame ) )
    }; //How you update the game

    useEffect(() => {
        //This runs when the page starts
        updateGame(g => {
            g.getBoard().updateBoard( GenerateFIDEBoard() );
            return g;
        })
    }, []); //Setting up the game

    /// -----------
    /// PLAYER DATA
    /// -----------
    const [ whiteCaptured, setWhiteCaptured ] = useState<Piece[]>([]);
    const [ blackCaptured, setBlackCaptured ] = useState<Piece[]>([]);
    const capturePiece : ( p : Piece ) => void = ( piece : Piece ) => {
        if ( piece.getColour() === WHITE ) {
            //If a white piece, add to black's captured
            setBlackCaptured( prev => [ ...prev, piece ] );
        }
        else {
            //If a black piece, add to white's captured
            setWhiteCaptured( prev => [ ...prev, piece ] );
        }

    }

    /// ------------
    /// GAME CONTROL
    /// ------------
    const [ targetingPiece, setTargetingPiece ] = useState< Piece | null >(null); //For targeting
    const movePiece: ( ev : React.DragEvent, square : Square ) => void = ( ev, square ) => updateGame( g => {
        //Get the board, and the piece being moved
        let board = g.getBoard();
        let pieceId = ev.dataTransfer.getData("text/plain");
        let matches = board.getPieces().filter( p => p.getId() === pieceId  );
        if ( matches.length !== 1 ) {
            console.log("There wasn't exactly 1 match!");
            return g;
        }
        let piece = matches[0];
        //Is it a move, or a capture?
        if ( piece.isLegalMove( square, board ) ) {
            piece.move( square, board );
        } else if ( piece.isLegalCapture( square, board ) ) {
            piece.capture( square, board, capturePiece )
        }

        setTargetingPiece(null)
        return g;
    } ); //Movement & Captures


    /// ----------------------
    /// GENERATING UI ELEMENTS
    /// ----------------------
    const getSquares = () => { //Displays the squares of the board
        let squares = [];
        for (let rank = 7; rank >= 0; rank--) {
            for (let file = 0; file <= 7; file++) {
                squares.push(<ChessSquare key={(rank + 1) + FILES[file]} rank={rank + 1} file={file + 1}/>
                )
            }
        }
        return squares;
    }; //Board Squares
    const getPieces = () => { //Displays the pieces on the board
        return game.getBoard().getPieces().map(
            piece => <ChessPiece
                piece={piece}
                active={ piece.getId() === targetingPiece?.getId() }
                target={ piece => setTargetingPiece(piece) }
                unTarget={ () => setTargetingPiece(null) }
            />
        )
    }; //Board Pieces
    const getTargetingSquares = () => { //Displays the targeting squares
        if (targetingPiece) {
            let legalMoves = game.getBoard().getPieces()
                .filter( piece => piece.getId() === targetingPiece.getId() )[0]
                .getLegalMoves( game.getBoard() )
            return legalMoves.map(
                square => <TargetingSquare
                    square={square}
                    onDrop={ ev => movePiece( ev, square ) }
                    isMove={ targetingPiece.isLegalMove( square, game.getBoard() ) }
                    isCapture={ targetingPiece.isLegalCapture( square, game.getBoard() ) }
                />
            )
        }
    }; //Targeting squares for moves & captures


    return <>
        <InfoBar captures={ blackCaptured } evaluation={ 0.01 * -materialEvaluation( game.getBoard() ) }/>
        <div id="ChessBoardWrapper">
            <div id="ChessBoardOuter">

                <div id="ChessBoardSquares" className="board">
                    { getSquares() }
                </div>

                {
                    targetingPiece ? //Renders the following if targetingPiece != null
                        <div id="ChessBoardTargeting" className="board">
                            { getTargetingSquares() }
                        </div> : null
                }

                <div id="ChessBoardPieces" className={`board ${ targetingPiece ? "targeting" : "" }`}>
                    { getPieces() }
                </div>

            </div>
        </div>
        <InfoBar captures={ whiteCaptured } evaluation={ 0.01 *materialEvaluation( game.getBoard() ) }/>
    </>

}