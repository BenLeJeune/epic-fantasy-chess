import React from 'react';
import Piece from "../../Pieces/Piece";
import {FILES} from "../../constants/consts";
import "./ChessPiece.css";

interface props {
    piece : Piece,
    target: ( piece : Piece ) => void,
    unTarget: ( piece : Piece ) => void
}

export default function ChessPiece({piece, target, unTarget}:props) {

    const onDragStart: ( e : React.DragEvent ) => void = e => {
        //This is fired when the dragging starts
        if ( e.dataTransfer ) {
            target(piece);
            e.dataTransfer.setData("text/plain", piece.getId());
            e.dataTransfer.effectAllowed = "move";
            console.log(("dragging..."));
        }
    }

    const getStyle = () => {
        return {
            gridColumnStart: FILES.indexOf(piece.getSquare().getFile()) + 1,
            gridColumnEnd: FILES.indexOf(piece.getSquare().getFile()) + 2,
            gridRowStart: 10 - piece.getSquare().getRank(),
            gridRowEnd: 9 - piece.getSquare().getRank()
        }
    }

    return <div className="piece"
                style={ getStyle() }
                key={ piece.getId() }
                draggable
                onDragStart={ onDragStart }
                onDragEnd={ () => unTarget(piece) }
    >
        <img src={ piece.getImg() } alt={ piece.getId() } className="pieceImg"/>
    </div>

}