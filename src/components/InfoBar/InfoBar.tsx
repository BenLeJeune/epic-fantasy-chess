import React from 'react';
import Piece from "../../Pieces/Piece";
import "./InfoBar.css"

interface props {
    captures: Piece[],
    evaluation: number
}

export default function InfoBar( { captures, evaluation } : props ) {

    return <div className="infoBar">
        <p className="materialEval">
            { evaluation !== 0 ?  "(" + (evaluation >= 0 ? "+" : "") +  evaluation + ")" : "" }
        </p>
        {
            captures.map(
                capturedPiece => <div className="capturedPiece">
                    <img src={capturedPiece.getImg()} alt={capturedPiece.getLongName()}/>
                </div>
            )
        }
    </div>

}