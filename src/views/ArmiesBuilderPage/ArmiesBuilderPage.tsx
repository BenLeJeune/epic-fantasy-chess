import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import "./ArmiesBuilderPage.css"
import Piece from "../../Classes/Piece"

export default function ArmiesBuilderPage() {

    let { armyID } = useParams<{ armyID: string }>();

    let [ armyName, setArmyName ] = useState("");

    let [ armyPieces, setArmyPieces ] = useState([1, 1, 1, 1, 1, 1, 1, 1])

    useLayoutEffect(() => {
        //Run this when the page first loads - retrieve data about the army
        const ARMY_KEY = "myArmies";
        let armiesJSON = localStorage.getItem( ARMY_KEY );
        if ( !armiesJSON ) {
            // If you don't have any armies, then you shouldn't be here!
            alert("No army detected. Redirecting to army menu.")
            window.location.href = "./armies";
        }
        else {
            let armies = JSON.parse(armiesJSON);
            setArmyName( armies[armyID].name );
            setArmyPieces( armies[armyID].pieces );
        }
    }, [])


    const getChessBoard = () => {
        let chessSquares = [];
        for (let i = 0; i <= 7; i++) {
            chessSquares.push(
                <div style={{ left: `${ ( i ) * 12.5 }%` }} className={`lowerBoardSquare ${ i % 2 === 0 ? "dark" : "light" }`}/>
            )
        }

        return chessSquares
    }

    const getChessPieces = () => armyPieces.map(
        ( piece, i ) => <div className="lowerBoardPiece"
                style={{ left: `${ ( i ) * 12.5 }%` }}
        >
            <img src={ Piece.getImage(piece) } />
        </div>
    )

    const getPieceLibrary = () => Piece.PIECES.map(
        ( piece, i ) => <div className="libraryPiece">
            <img src={ Piece.getImage(piece) } />
        </div>
    )

    return <div id="ArmiesBuilderPage">
        <h1>{ armyID }</h1>

        <div className="armiesManager">

            <div className="pieceInfoPreview">

            </div>

            <div className="piecesList">
                { getPieceLibrary() }
            </div>

            <div className="lowerBoard">

                <div className="chessBoardPadding">

                    <div className="chessBoard" style={{width: "100%"}}>
                        { getChessBoard() }
                        { getChessPieces() }
                    </div>

                </div>

            </div>

        </div>


    </div>

}