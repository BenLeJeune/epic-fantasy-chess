import React, {useEffect, useState} from "react";
import ChessSquare from "../ChessSquare/ChessSquare";
import {BLACK, FILES} from "../../constants/consts";
import "./ChessBoard.css";
import Game from "../../Classes/Game";
import Pawn from "../../Pieces/FIDE/Pawn";
import Rook from "../../Pieces/FIDE/Rook";
import ChessPiece from "../ChessPiece/ChessPiece";
import Knight from "../../Pieces/FIDE/Knight";

export default function ChessBoard() {

    const [ game, updateGame ] = useState( new Game() );

    useEffect(() => {
        //This runs when the page starts
        updateGame( _game => {

            for (let i = 0; i <= 7; i++) {
                let whiteSquare = _game.getBoard().getSquare(FILES[i], 2);
                let wPawn = new Pawn(whiteSquare);
                whiteSquare.setPiece( wPawn );
                let blackSquare = _game.getBoard().getSquare(FILES[i], 7);
                let bPawn = new Pawn(blackSquare, BLACK);
                blackSquare.setPiece(bPawn);

            }

            return Object.assign({}, _game);
        } )
    }, []);

    const getSquares = () => { //Gets the squares
        let squares = [];
        for (let rank = 7; rank >= 0; rank--) {
            for (let file = 0; file <= 7; file++) {
                squares.push(<ChessSquare key={(rank + 1) + FILES[file]} rank={rank + 1} file={file + 1}/>
                )
            }
        }
        return squares;
    };

    const getPieces = () => {
        return game.getBoard().getPieces().map(
            piece => <ChessPiece piece={piece} />
        )
    }

    return <div id="ChessBoardWrapper">
        <div id="ChessBoardOuter">

            <div id="ChessBoardSquares" className="board">
                { getSquares() }
            </div>

            <div id="ChessBoardPieces" className="board">
                { getPieces() }
            </div>

        </div>
    </div>

}