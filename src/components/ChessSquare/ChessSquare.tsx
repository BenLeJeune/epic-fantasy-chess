import "./ChessSquare.css";
import React from 'react';
import {FILES} from "../../types";
import Piece from "../../Classes/Piece";

interface props {
    position: number
}

export default function ChessSquare( { position } : props ) {

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
            labels.push( <span className="sqLabel left" key="rank">{ Piece.getRank(position) }</span> )
        }

        return labels;
    }

    return <div style={Piece.getStyle( position )} className={`chessSquare ${ getCol() }`}
                id={ `square-${ FILES[Piece.getFile(position)] }${ Piece.getRank(position) }` }>
        {
            getLabel()
        }
    </div>

}