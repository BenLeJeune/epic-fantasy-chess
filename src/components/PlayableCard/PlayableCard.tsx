import React, {useLayoutEffect, useRef, useState} from "react";
import "./PlayableCard.css";
import Card from "../../Cards/Card";

interface props {
    card: Card,
    handPosition: number,
    handSize: number,
    dragStartCallback: () => void,
    dragEndCallback: () => void,
    draggable: boolean
}


export default function PlayableCard(props: props) {

    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const onDragStart = ( e : React.DragEvent ) => {
        //Fired when the dragging starts
        if ( e.dataTransfer ) {
            props.dragStartCallback();
            e.dataTransfer.setData( "text/plain", props.card.id )
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
            let currentRotation = 5 * ( props.handPosition - closestPoint );
            if (currentRotation === 0 && !oddHand) currentRotation += props.handPosition === centreOfHandStart ? -2.5 : 2.5

            containerRef.current.style.transform = `rotateZ(${currentRotation}deg) translateY(${Math.abs((currentRotation * 5)) - 20}px)`;
        }
    }, [props.handPosition, props.handSize])

    return <div ref={containerRef}
                draggable={props.draggable}
                onDragStart={ e => onDragStart(e) }
                onDragEnd={ () => onDragEnd() }
                className={`playableCardContainer ${props.draggable ? "drag" : "noDrag"}`}>
        <div ref={cardRef} className="playableCard">
            <div className="cardChaosScore">
                <div className="score">{ props.card.cost }</div>
                <div className="speed">{ props.card.fast ? "Fast" : "" }</div>
            </div>
            <div className="cardTitle">
                { props.card.cardName }
            </div>
            <div className="cardDescription">
                { props.card.description }
            </div>
            <div className="cardExpac">
                {props.card.expac}
            </div>
        </div>
    </div>

}