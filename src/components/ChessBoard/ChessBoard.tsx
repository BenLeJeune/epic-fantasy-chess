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

export default function ChessBoard() {

    const [ game, setGame ] = useState( new Game() );

    const updateGame = ( callback : ( g:Game ) => Game ) => {
        //Used for simplifying the setGame() process
        let newGame = callback( game );
        setGame( Object.assign( {}, newGame ) )
    }

    useEffect(() => {
        //This runs when the page starts
        setGame( _game => {

            let board = _game.getBoard()

            let square = board.getSquare("b", 1);
            new Knight( square );

            console.log( board.getSquaresLinear() )

            return Object.assign({}, _game);
        } );

        setInterval(() =>{
            updateGame( g => {
                let board = g.getBoard();
                let knight = board.getPieces()[0];
                let bSquare = board.getSquare("b", 1);
                let cSquare = board.getSquare("c", 3);
                    if ( knight.getSquare() === bSquare ) {
                        knight.move( cSquare )
                    }
                    else if ( knight.getSquare() === cSquare ) {
                        knight.move( bSquare );
                    }
                return g;
            } )
        }, 1000)
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