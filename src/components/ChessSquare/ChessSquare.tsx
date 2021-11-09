import "./ChessSquare.css";
import React from 'react';
import {FILES} from "../../types";
import Piece from "../../Classes/Piece";

interface props {
    position: number,
    highlight : boolean,
    rotated : boolean,
    moveCircle: boolean
}

export default function ChessSquare( { position, highlight, rotated, moveCircle = false } : props ) {

    const getCol = () => {
        if ( ( 7 * Piece.getRank(position) + Piece.getFile(position) ) % 2 === 1 ) return "light";
        else return "dark"
    }

    const getLabel = () => {
        const labels = [];
        if ( Piece.getRank(position) === 0 ) { //We show the file if on the first rank
            labels.push( <span className="sqLabel bottom" key="file">{ FILES[ Piece.getFile(position) ] }</span> )
        }
        if ( Piece.getFile(position) === 0 ) { //And we show the rank if on the first file
            labels.push( <span className="sqLabel left" key="rank">{ Piece.getRank(position) + 1 }</span> )
        }

        return labels;
    }

    return <div style={Piece.getStyle( position, rotated )}
                className={`chessSquare ${ getCol() } ${ moveCircle ? "moveCircle" : "" }`}
                id={ `square-${ Piece.getSquareName(position) }` }
                key={ `square-${ Piece.getSquareName(position) }` }>
        {
            getLabel()
        }
        {
            highlight ? <div className="highlight"/> : null
        }
    </div>

}