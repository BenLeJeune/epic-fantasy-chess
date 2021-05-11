import React, {useEffect, useState} from "react";
import ChessSquare from "../ChessSquare/ChessSquare";
import {FILES} from "../../constants/consts";
import "./ChessBoard.css";

export default function ChessBoard() {

    useEffect(() => {
        //This runs when the page starts
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
    }

    return <div className="ChessBoardContainer">
        { getSquares() }
    </div>

}