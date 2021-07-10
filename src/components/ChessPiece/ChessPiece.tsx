import React, {useEffect, useLayoutEffect, useRef} from 'react';
import "./ChessPiece.css";
import Piece from "../../Classes/Piece";

interface props {
    position : number,
    piece : number,
    target: ( position : number ) => void,
    unTarget: ( position : number ) => void,
    active : boolean,
    id : string,
    draggable : boolean
}

export default function ChessPiece({position, piece, target, unTarget, active, id, draggable}:props) {

    let oldPos = useRef<number>(position);

    let pieceEl = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (pieceEl.current) {
            let el = pieceEl.current

            ///We want to get the difference in ranks and files
            let verticalDiff = Piece.getFile(position) - Piece.getFile(oldPos.current);
            let horizontalDiff = Piece.getRank( position ) - Piece.getRank( oldPos.current );


            el.style.transition = `none`;
            el.style.transform = `translate(${ -verticalDiff * 100 }%, ${ horizontalDiff * 100 }%)`;
            setTimeout(() => {
                el.style.transition = `transform 0.25s ease`;
                el.style.transform = `translate(0, 0)`
            }, 0);
        }

        oldPos.current = position;

    }, [ position ])

    const onDragStart: ( e : React.DragEvent ) => void = e => {
        //This is fired when the dragging starts
        if ( e.dataTransfer ) {
            target(piece);
            e.dataTransfer.setData("text/plain", JSON.stringify( [ piece, position ] ));
            e.dataTransfer.effectAllowed = "move";
        }
    }



    return <div className={`piece ${ active ? "active" : "" }`}
                ref={ pieceEl }
                id={ id }
                key={ id }
                style={ Piece.getStyle(position) }
                draggable={ draggable }
                onDragStart={ draggable ? onDragStart : () => false }
                onDragEnd={ () => unTarget(piece) }
    >
        <img src={ Piece.getImage( piece ) } alt={ piece.toString() } className="pieceImg"/>
    </div>

}