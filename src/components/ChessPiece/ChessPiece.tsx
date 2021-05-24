import React from 'react';
import "./ChessPiece.css";
import Piece from "../../Classes/Piece";

interface props {
    position : number,
    piece : number,
    target: ( position : number ) => void,
    unTarget: ( position : number ) => void,
    active : boolean
}

export default function ChessPiece({position, piece, target, unTarget, active}:props) {

    const onDragStart: ( e : React.DragEvent ) => void = e => {
        //This is fired when the dragging starts
        if ( e.dataTransfer ) {
            target(piece);
            e.dataTransfer.setData("text/plain", JSON.stringify( [ piece, position ] ));
            e.dataTransfer.effectAllowed = "move";
            console.log(("dragging..."));
        }
    }



    return <div className={`piece ${ active ? "active" : "" }`}
                style={ Piece.getStyle(position) }
                key={`${ Piece.getFile(position) }-${ Piece.getRank(position) }`}
                draggable
                onDragStart={ onDragStart }
                onDragEnd={ () => unTarget(piece) }
    >
        <img src={ Piece.getImage( piece ) } alt={ piece.toString() } className="pieceImg"/>
    </div>

}