import React from 'react';
import Piece from "../../Classes/Piece";
import "./PiecePromotionUI.css";

interface Props {
    above : boolean,
    positionFrom : number,
    positionTo : number,
    validPieces : number[],
    promoting : number,
    callback: ( pieceFrom: number, pieceTo: number, positionFrom: number, positionTo : number ) => void
}


export default function PiecePromotionUI( { above, positionFrom,  positionTo, validPieces, promoting, callback } : Props ) {

    const getHeadStyle = () => {
        return {
            left: `${ Piece.getFile( positionTo ) * 12.5 }%`,
            top: `${ ( 7 - Piece.getRank( positionTo ) ) * 12.5 }%`,
            borderRadius: above ? "1rem 1rem 0 0" : "0 0 1rem 1rem"
        }
    }

    const getBodyStyle = () => {
        let left = Math.max(Math.min(Piece.getFile( positionTo ) - (validPieces.length / 2) , 8 - ( validPieces.length ) ), 0)
        return {
            width: `${ validPieces.length * 12.5 }%`,
            left: `${ ( left * 12.5) }%`,
            top: `${ ( 7 - Piece.getRank( positionTo ) + (above ? 1 : -1) ) * 12.5 }%`,
            borderTopRightRadius: ( !above || left + validPieces.length !== Piece.getFile( positionTo ) + 1) ? "1rem" : "0",
            borderTopLeftRadius: ( !above || 0 !== Piece.getFile( positionTo ) ) ? "1rem" : "0",
            borderBottomRightRadius: ( above || left + validPieces.length !== Piece.getFile( positionTo ) + 1) ? "1rem" : "0",
            borderBottomLeftRadius: ( above || 0 !== Piece.getFile( positionTo ) ) ? "1rem" : "0",

        }
    }

    const getHead = () => <div id="PiecePromotionHead" style={ getHeadStyle() }>
        <img src={ Piece.getImage( promoting ) } alt=""/>
    </div>

    const getBody = () => <div id="PiecePromotionBody" style={ getBodyStyle() }>
        {
            validPieces.map(
                piece => <div className="promotionPiece"
                              style={{ width: `${100 / validPieces.length}%` }}
                              onMouseDown={ () => callback( promoting, piece, positionFrom, positionTo ) }
                >
                    <img src={ Piece.getImage( piece ) } alt=""/>
                </div>
            )
        }
    </div>

    return above ?
        <> { getHead() } { getBody() }</> :
        <> { getBody() } { getHead() } </>

}