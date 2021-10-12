import React, { useState, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import "./ArmiesBuilderPage.css"
import { Army } from "../../Presets/Armies";
import Piece from "../../Classes/Piece"
import NiceButton from "../../components/NiceButton/NiceButton";
import NavBar from "../../components/NavBar/NavBar";

export default function ArmiesBuilderPage() {

    let { armyID } = useParams<{ armyID: string }>();

    let [ armyName, setArmyName ] = useState("");

    let [ armyPieces, setArmyPieces ] = useState([1, 1, 1, 1, 1, 1, 1, 1])

    let [ changesMade, setChangesMade ] = useState(false);

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

    let [ piecePreview, setPiecePreview ] = useState(0);


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
                 onDrop={ e => onDrop( e, i ) }
                 onDragOver={ e => {
                     e.preventDefault();
                     e.dataTransfer.dropEffect = "move";
                 } }
        >
            <img src={ Piece.getImage(piece) } />
        </div>
    )

    const pieceDragStart = ( e : React.DragEvent, piece : number ) => {
        if ( e.dataTransfer ) {
            e.dataTransfer.setData("text", `${piece}`);
            e.dataTransfer.effectAllowed = "move";
        }
    }

    const pieceDragEnd = ( piece : number ) => {

    }

    const onDrop = ( e : React.DragEvent, i : number ) => {
        let piece : number = Number(e.dataTransfer.getData("text"));
        //We dragged this piece to the target location
        if ( i !== 4 ) { //We can't replace the king!
            setArmyPieces( prev => [
                ...prev.slice(0, i), piece, ...prev.slice(i+1)
            ] )
            setChangesMade(true);
        }
    }

    const getPieceLibrary = () => Piece.PIECES.map(
        ( piece, i ) => <div className="libraryPiece" onMouseOver={ () => setPiecePreview(piece) }
             draggable
             onDragStart={ e => pieceDragStart( e, piece ) }
             onDragEnd={ () => pieceDragEnd( piece ) }
        >
            <img src={ Piece.getImage(piece) } />
        </div>
    )

    const saveChanges = () => {
        const ARMY_KEY = "myArmies";

        let armiesJSON = localStorage.getItem(ARMY_KEY);

        if (armiesJSON) {
            let armies = JSON.parse(armiesJSON);
            let newName = prompt("Choose your army's name", armyName) as string;

            if ( newName !== armyName ) delete armies[armyName]; //Get rid of the old key
            armies[newName] = new Army( armyPieces, newName );

            localStorage.setItem(ARMY_KEY, JSON.stringify(armies));

            window.location.href = `/armies`;
        }
    }

    return <div id="ArmiesBuilderPage">

        <NavBar/>
        <h1>{ armyID }</h1>

        <div className="armiesManager">

            <div className="pieceInfoPreview">

                <div className={`pieceInfoPreviewBox ${ piecePreview === 0 ? "noPreview" : "preview" }`}>
                    {
                        piecePreview === 0 ? <p className="faded">Hover over a piece to look at it.</p> : <>
                            <h1 className="PieceInfo">{ Piece.getPiece(piecePreview)?.longName }</h1>
                            <div className="imgContainer">
                                <img src={ Piece.getImage(piecePreview) } />
                            </div>
                            {
                                piecePreview === Piece.Pawn || piecePreview === Piece.King ?
                                    <p className="faded">This piece cannot be altered or swapped.</p> : <><br/><br/></>
                            }
                            <p className="info">
                                <b>Notation:</b> { Piece.getPiece(piecePreview)?.shortName } <br/>
                                <b>Value:</b> { piecePreview === Piece.King ? "Infinity" : Piece.getPiece(piecePreview)?.materialValue } <br/>
                                <br/>
                                { Piece.getPiece(piecePreview)?.movesDescription } <br/><br/>
                                { Piece.getPiece(piecePreview)?.specialMoves.map(s => <>{s} </>) } <br/><br/>
                                { Piece.getPiece(piecePreview)?.notes } <br/><br/>

                            </p>
                        </>
                    }
                </div>

            </div>

            <div className="piecesList">
                <div className="pieceLibrary">

                    { getPieceLibrary() }

                </div>
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

        {
            changesMade ?
                <div className="saveChanges">
                    <NiceButton
                        onClick={ saveChanges }
                        text="Save Changes"
                    />
                </div> : null
        }

    </div>

}