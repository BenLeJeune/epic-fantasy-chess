import React, {useEffect, useLayoutEffect, useRef} from 'react';
import "./ChessPiece.css";
import Piece from "../../Classes/Piece";

interface props {
    position : number,
    piece : number,
    target: ( source: TargetingType ) => void,
    unTarget: ( source : TargetingType ) => void,
    onHover: () => void,
    onUnHover: () => void,
    onRightClick: ( id : string ) => void,
    active : boolean,
    id : string,
    draggable : boolean,
    clickable: boolean,
    rotated: boolean
}

type TargetingType = "piece-click" | "piece-drag" | "card-drag" | "card-click";


export default function ChessPiece({position, piece, target, unTarget, onHover, onUnHover, active, id, draggable, rotated, onRightClick}:props) {

    let oldPos = useRef<number>(position);

    let pieceEl = useRef<HTMLDivElement>(null);
    let imgRef = useRef<HTMLImageElement>(null);

    useLayoutEffect(() => {
        if (pieceEl.current) {
            let el = pieceEl.current

            ///We want to get the difference in ranks and files
            let verticalDiff = Piece.getFile(position) - Piece.getFile(oldPos.current);
            let horizontalDiff = Piece.getRank( position ) - Piece.getRank( oldPos.current );

            if (rotated) { //Rotated if the board is rotated
                verticalDiff = -verticalDiff;
                horizontalDiff = -horizontalDiff;
            }

            el.style.transition = `none`;
            el.style.transform = `translate(${ -verticalDiff * 100 }%, ${ horizontalDiff * 100 }%)`;
            setTimeout(() => {
                el.style.transition = `transform 0.25s ease`;
                el.style.transform = `translate(0, 0)`
            }, 0);
        }

        oldPos.current = position;

    }, [ position ])

    useLayoutEffect(() => {
        if (imgRef.current) {
            if (!active) imgRef.current.style.transform = ""
        }
    }, [active])

    const onDragStart: ( e : React.DragEvent ) => void = e => {
        //This is fired when the dragging starts
        if (imgRef.current) imgRef.current.style.transform = "";
        if ( e.dataTransfer ) {
            target("piece-drag");
            e.dataTransfer.setData("text/plain", JSON.stringify( [ piece, position ] ));
            e.dataTransfer.effectAllowed = "move";
        }
    }

    const clickHandler = ( e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
        if ( e.button === 2 ) {
            e.preventDefault();
            onRightClick(id);
        }
        if ( e.button === 0 && (draggable) ) {
            //Left click
            target("piece-click");
            if (imgRef.current) imgRef.current.style.transform = "translateY(.25rem) scale(0.95)";
        }
    }

    return <div className={`piece ${ active ? "active" : "" } ${ piece > 0 ? "white" : "black" }`}
                ref={ pieceEl }
                id={ id }
                key={ id }
                style={ Piece.getStyle(position, rotated) }
                draggable={ draggable }
                onDragStart={ draggable ? onDragStart : () => false }
                onDragEnd={ () => unTarget("piece-drag") }
                onMouseEnter={onHover}
                onMouseLeave={onUnHover}
                onMouseDown={ e => clickHandler(e)}
                onContextMenu={ e => clickHandler(e) }
    >
        <img ref={imgRef} src={ Piece.getImage( piece ) } alt={ piece.toString() } className="pieceImg"/>
    </div>

}