import React, {MouseEventHandler} from 'react';
import "./TargetingSqaure.css"
import Piece from "../../Classes/Piece";
import Game from "../../Classes/Game";

interface props {
    position : number,
    onDrop : ( e : React.DragEvent ) => void,
    isMove : boolean,
    isCapture : boolean,
    onClick: () => void,
    rotated: boolean
}

export default function TargetingSquare( { position, onDrop, isMove, onClick, isCapture, rotated } : props ) {


    const clickHandler = ( e:React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
        e.stopPropagation(); //Stops the click from bubbling
        onClick();
    }

    return <div
        style={ Piece.getStyle( position, rotated ) }
        className={`targetingSquare ${ isMove ? "move" : "" } ${ isCapture ? "capture" : "" }`}
        id={`target_${ Piece.getSquareName( position ) }`}
        onDrop={ onDrop }
        onMouseDown={ clickHandler }
        onDragOver={ e => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        } }
    />

}

export {}