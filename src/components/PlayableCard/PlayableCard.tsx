import React, {useLayoutEffect, useRef, useState} from "react";
import "./PlayableCard.css";

interface props {
    handPosition: number,
    handSize: number,
    dragStartCallback: () => void,
    dragEndCallback: () => void
}


export default function PlayableCard(props: props) {

    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const onDragStart = ( e : React.DragEvent ) => {
        //Fired when the dragging starts
        if ( e.dataTransfer ) {
            props.dragStartCallback();
        }
    }

    const onDragEnd = () => {
        props.dragEndCallback();
    }

    useLayoutEffect(() => {
        if (containerRef.current) {
            ///
            /// Handles position while idle in hand
            ///
            let minRotation = -30, maxRotation = 30, oddHand = props.handSize % 2 !== 0
            let centreOfHandStart = Math.ceil( props.handSize / 2 );
            let centreOfHandEnd = oddHand ? centreOfHandStart : centreOfHandStart + 1;
            let closestPoint = props.handPosition <= centreOfHandStart ? centreOfHandStart : centreOfHandEnd;
            let currentRotation = 10 * ( props.handPosition - closestPoint );
            if (currentRotation === 0 && !oddHand) currentRotation += props.handPosition === centreOfHandStart ? -5 : 5

            containerRef.current.style.transform = `rotateZ(${currentRotation}deg) translateY(${Math.abs((currentRotation * 10)) - 20}px)`;
        }
    }, [props.handPosition, props.handSize])

    return <div ref={containerRef}
                draggable
                onDragStart={ e => onDragStart(e) }
                onDragEnd={ () => onDragEnd() }
                className="playableCardContainer">
        <div ref={cardRef} className="playableCard">
            <div className="cardChaosScore">
                4
            </div>
            <div className="cardTitle">
                Expendable
            </div>
            <div className="cardDescription">
                Summon a pawn adjacent to a friendly piece.
            </div>
        </div>
    </div>

}