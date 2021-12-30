import React, {useState, useLayoutEffect, useRef} from "react";
import { useParams } from "react-router-dom";
import "./ArmiesBuilderPage.css"
import { Army } from "../../Presets/Armies";
import Piece from "../../Classes/Piece"
import NiceButton from "../../components/NiceButton/NiceButton";
import NavBar from "../../components/NavBar/NavBar";
import { ARMY_KEY } from "../../KEYS";

export default function ArmiesBuilderPage() {

    let { armyID } = useParams<{ armyID: string }>();

    let [ armyName, setArmyName ] = useState("");

    let [ armyPieces, setArmyPieces ] = useState([1, 1, 1, 1, 1, 1, 1, 1])

    let [ changesMade, setChangesMade ] = useState(false);

    useLayoutEffect(() => {
        //Run this when the page first loads - retrieve data about the army
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
            {piece === Piece.None ? null : <img src={Piece.getImage(piece)}
                  draggable
                  onDragStart={e => pieceDragStart(e, piece, i)}
                  onDragEnd={e => pieceDragEnd(e, i)}
            />}
        </div>
    )

    const pieceDragStart = ( e : React.DragEvent, piece : number, fromIndex?:number ) => {
        if ( e.dataTransfer ) {
            let text = `${piece}`;
            if (fromIndex !== undefined) text += `-${fromIndex}`
            e.dataTransfer.setData("text", text);
            e.dataTransfer.effectAllowed = "move";
        }
    }

    const pieceDragEnd = ( e : React.DragEvent, i : number ) => {

        //IF WE DRAGGED IT TO OUTSIDE THE CHESSBOARD
        let board  = document.getElementById("ArmyChessBoard");
        if (board && Math.abs(armyPieces[i]) !== Piece.King) {
            let { top, height, left, width } = board.getBoundingClientRect();
            let { clientX, clientY } = e;
            if ( clientY < top || clientY > top + height || clientX < left || clientX > left + width ) {
                //REMOVE THE PIECE

                let newPieces = [...armyPieces].map((p, index) => index === i ? Piece.None : p);

                setArmyPieces( newPieces )
                setChangesMade(true);

                if (pointBuyRef.current) {
                    pointBuyRef.current.className = "";
                    if (newPieces.filter( p => p !== 6 ).reduce((prev, next) => (Piece.getPiece(next)?.materialValue || 0) + prev, 0 ) > 31) {
                        setTimeout(() => {
                            if (pointBuyRef.current) pointBuyRef.current.className = "invalid";

                        }, 0)
                    }
                }
            }
        }
    }

    let pointBuyRef = useRef<HTMLElement>(null);
    const getPointBuyTotal = () => armyPieces.filter( p => p !== 6 ).reduce((prev, next) => (Piece.getPiece(next)?.materialValue || 0) + prev, 0 );

    const onDrop = ( e : React.DragEvent, i : number ) => {
        let droppedInfo = e.dataTransfer.getData("text").split("-");
        console.log(droppedInfo);
        let piece : number = Number(droppedInfo[0]);
        let indexFrom = Number(droppedInfo[1] || -1)
        //We dragged this piece to the target location
        if ( i !== 4 && Math.abs(piece) !== Piece.King && Piece.getPiece(piece) ) { //We can't replace the king!

            //piece is the piece we are dragging
            //If the dropped index !== -1, then we want to swap the pieces.
            let replacementPiece = armyPieces[i] || Piece.None;
            console.log(replacementPiece)

            let newPieces = [...armyPieces].map((p, index) => {
                if (index === i) {
                    //REPLACING PIECE
                    return piece;
                }
                else if (index === indexFrom) {
                    return replacementPiece;
                }
                else return p;
            })
            setArmyPieces( newPieces )
            setChangesMade(true);

            if (pointBuyRef.current) {
                pointBuyRef.current.className = "";
                if (newPieces.filter( p => p !== 6 ).reduce((prev, next) => (Piece.getPiece(next)?.materialValue || 0) + prev, 0 ) > 31) {
                    setTimeout(() => {
                            if (pointBuyRef.current) pointBuyRef.current.className = "invalid";

                        }, 0)
                }
            }
        }
    }

    const getPieceLibrary = () => Piece.PIECES.filter( p => Piece.getPiece(p) && Piece.getPiece(p)?.categories.indexOf("Token") === -1 ).map(
        ( piece, i ) => <div className="libraryPiece" onMouseOver={ () => setPiecePreview(piece) }>
            <img src={ Piece.getImage(piece) }
             draggable={ piece !== Piece.King }
             onDragStart={ e => pieceDragStart( e, piece ) }/>
        </div>
    )

    const saveChanges = () => {

        if (getPointBuyTotal() > 31) {
            let sure = window.confirm("Your army is over the point buy limit. You will not be able to play with this army. Are you sure you want to save?");
            if (!sure) return;
        }

        let armiesJSON = localStorage.getItem(ARMY_KEY);

        if (armiesJSON) {
            let armies = JSON.parse(armiesJSON);
            let newName = prompt("Choose your army's name", armyName) || armyName;

            if ( newName !== armyName ) delete armies[armyName]; //Get rid of the old key
            armies[newName] = new Army( armyPieces, newName );

            localStorage.setItem(ARMY_KEY, JSON.stringify(armies));

            window.location.href = `/armies`;
        }
    }

    return <div id="ArmiesBuilderPage" className="paddedTop">

        <NavBar/>
        <h1>{ armyID }</h1>

        <div className="armiesManager">

            <div className="pieceInfoPreview">

                <div className={`pieceInfoPreviewBox ${ piecePreview === 0 ? "noPreview" : "preview" }`}>
                    {
                        piecePreview === 0 ? <>
                            <p className="faded">Hover over a piece to look at it.</p>
                            <p className="faded">Drag pieces to change your army.</p>
                        </>

                        : <>
                            <h1 className="PieceInfo">{ Piece.getPiece(piecePreview)?.longName }</h1>
                            <div className="imgContainer">
                                <img src={ Piece.getImage(piecePreview) } />
                            </div>
                            {
                                piecePreview === Piece.Pawn ?
                                    <p className="faded">You cannot change your front row of pawns.</p> : <><br/><br/></>
                            }
                            {
                                piecePreview === Piece.King ?
                                    <p className="faded">This piece cannot be moved, swapped or altered.</p> : <><br/><br/></>
                            }
                            <p className="info">
                                <b>Notation:</b> { Piece.getPiece(piecePreview)?.shortName } <br/>
                                <b>Value:</b> { piecePreview === Piece.King ? "Infinity" : Piece.getPiece(piecePreview)?.materialValue } <br/>
                                <br/>
                                { Piece.getPiece(piecePreview)?.movesDescription } <br/><br/>
                                { Piece.getPiece(piecePreview)?.specialMoves.map((s, i, x) =>
                                    <>{s}{ i+1 === x.length ? <> <br/><br/> </> : null }</>) }
                                { Piece.getPiece(piecePreview)?.notes ? <>{Piece.getPiece(piecePreview)?.notes}<br/><br/></> : null }

                            </p>
                            <p className="faded">
                                Tags:
                                { Piece.getPiece(piecePreview)?.categories.map((c, i, x) => <> {c}{ i + 1 === x.length ? "" : "," }</> ) }
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

                    <div className="pointBuyCounter">
                        <p>Point Buy: <strong ref={pointBuyRef}>{ getPointBuyTotal() }/31 </strong> </p>
                    </div>

                    <div className="chessBoard" id="ArmyChessBoard" style={{width: "100%"}}>

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