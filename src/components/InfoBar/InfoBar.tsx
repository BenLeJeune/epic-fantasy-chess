import React from 'react';
import "./InfoBar.css"
import Piece from "../../Classes/Piece";

interface props {
    captures: number[],
    evaluation: number
}

export default function InfoBar( { captures, evaluation } : props ) {

    return <div className="infoBar">
        <p className="materialEval">
            { evaluation !== 0 ?  "(" + (evaluation >= 0 ? "+" : "") +  evaluation + ")" : "" }
        </p>
        {
            captures.map(
                ( piece, index ) => <div key={ (Piece.getPiece(piece)?.longName || "Piece") + `${index}` } className="capturedPiece">
                    <img title={`${ Piece.getPiece(piece)?.longName } (${ Piece.getPiece(piece)?.materialValue })`} src={Piece.getImage(piece)} alt={Piece.getPiece(piece)?.shortName || "unknown piece"}/>
                </div>
            )
        }
    </div>

}

export {}