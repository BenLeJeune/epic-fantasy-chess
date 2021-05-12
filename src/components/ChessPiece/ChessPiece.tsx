import React from 'react';
import Piece from "../../Pieces/Piece";
import {FILES} from "../../constants/consts";
import "./ChessPiece.css";

interface props {
    piece : Piece
}

export default function ChessPiece({piece}:props) {

    const getStyle = () => {
        return {
            gridColumnStart: FILES.indexOf(piece.getSquare().getFile()) + 1,
            gridColumnEnd: FILES.indexOf(piece.getSquare().getFile()) + 2,
            gridRowStart: 10 - piece.getSquare().getRank(),
            gridRowEnd: 9 - piece.getSquare().getRank()
        }
    }

    return <div className="piece" style={ getStyle() }>
        <img src={ piece.getImg() } alt={ piece.getId() } className="pieceImg"/>
    </div>

}