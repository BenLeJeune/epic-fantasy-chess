import React from 'react';
import "./TargetingSqaure.css"
import Piece from "../../Classes/Piece";
import Game from "../../Classes/Game";

interface props {
    position : number,
    onDrop : ( e : React.DragEvent ) => void,
    isMove : boolean,
    isCapture : boolean,
    rotated: boolean
}

export default function TargetingSquare( { position, onDrop, isMove, isCapture, rotated } : props ) {


    return <div
        style={ Piece.getStyle( position, rotated ) }
        className={`targetingSquare ${ isMove ? "move" : "" } ${ isCapture ? "capture" : "" }`}
        id={`target_${ Piece.getSquareName( position ) }`}
        onDrop={ onDrop }
        onDragOver={ e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        } }
    />

}

export {}