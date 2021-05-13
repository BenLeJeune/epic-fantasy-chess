import React, {useEffect, useState} from "react";
import ChessSquare from "../ChessSquare/ChessSquare";
import {BLACK, FILES} from "../../constants/consts";
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

export default function ChessBoard() {

    const [ game, setGame ] = useState( new Game() );

    const updateGame = ( callback : ( g:Game ) => Game ) => {
        //Used for simplifying the setGame() process
        let newGame = callback( game );
        setGame( Object.assign( {}, newGame ) )
    }

    useEffect(() => {
        //This runs when the page starts
        updateGame(g => {
            g.getBoard().updateBoard( GenerateFIDEBoard() );
            return g;
        })
    }, []);

    //Handles piece moving logic
    const movePiece: ( ev : React.DragEvent, square : Square ) => void
        = ( ev, square ) => updateGame( g => {
            let board = g.getBoard();
            let pieceId = ev.dataTransfer.getData("text/plain");
            let matches = board.getPieces().filter( p => p.getId() === pieceId  );
            if ( matches.length !== 1 ) {
                console.log("There wasn't exactly 1 match!");
                return g;
            }
            let piece = matches[0];
            piece.move( square, board );
            setTargetingPiece(null)
            return g;
    } )

    const getSquares = () => { //Displays the squares of the board
        let squares = [];
        for (let rank = 7; rank >= 0; rank--) {
            for (let file = 0; file <= 7; file++) {
                squares.push(<ChessSquare key={(rank + 1) + FILES[file]} rank={rank + 1} file={file + 1}/>
                )
            }
        }
        return squares;
    };

    const getPieces = () => { //Displays the pieces on the board
        return game.getBoard().getPieces().map(
            piece => <ChessPiece
                piece={piece}
                target={ piece => setTargetingPiece(piece) }
                unTarget={ () => setTargetingPiece(null) }
            />
        )
    }

    const getTargetingSquares = () => { //Displays the targeting squares
        if (targetingPiece) {
            let legalMoves = game.getBoard().getPieces()
                .filter( piece => piece.getId() === targetingPiece.getId() )[0]
                .getLegalMoves( game.getBoard() )
            return legalMoves.map(
                square => <TargetingSquare
                    square={square}
                    onDrop={ ev => movePiece( ev, square ) }
                />
            )
        }
    }

    const [ targetingPiece, setTargetingPiece ] = useState< Piece | null >(null);

    return <div id="ChessBoardWrapper">
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

            <div id="ChessBoardPieces" className="board">
                { getPieces() }
            </div>

        </div>
    </div>

}