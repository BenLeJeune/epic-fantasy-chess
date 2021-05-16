import React from 'react';
import Square from "../../Classes/Square";
import {FILES} from "../../constants/consts";
import "./TargetingSqaure.css"
import Piece from "../../Pieces/Piece";

interface props {
    square : Square,
    onDrop : ( e : React.DragEvent ) => void,
    isMove : boolean,
    isCapture : boolean
}

export default function TargetingSquare( { square, onDrop, isMove, isCapture } : props ) {

    const getStyle = () => {
        return {
            gridColumnStart: FILES.indexOf(square.getFile()) + 1,
            gridColumnEnd: FILES.indexOf(square.getFile()) + 2,
            gridRowStart: 10 - square.getRank(),
            gridRowEnd: 9 - square.getRank()
        }
    }

    return <div
        style={ getStyle() }
        className={`targetingSquare ${ isMove ? "move" : "" } ${ isCapture ? "capture" : "" }`}
        id={`target_${ square.getSquareName() }`}
        onDrop={ onDrop }
        onDragOver={ e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        } }
    />

}