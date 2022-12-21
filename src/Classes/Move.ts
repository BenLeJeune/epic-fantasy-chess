import {FILES, Move, SpecialMove} from "../types";
import Piece from "./Piece";
import GamePiece from "../Pieces/GamePiece";
import Pawn from "../Pieces/FIDE/Pawn";
import {AdditionalOptions} from "./Game";

export default class ActualMove {

    public readonly from : number;
    public readonly to : number;
    public readonly moving : number;
    public readonly captured : number;
    public readonly specify : number;

    public readonly special : SpecialMove | undefined
    public readonly additional: Partial<AdditionalOptions>

    public static NONE = 0;
    public static RANK = 1;
    public static FILE = 2;
    public static BOTH = 3;

    public getMoveName : () => string = () => {
        //If there was no capture
        if ( Piece.getPiece(this.moving) === null ) {
            if (this.additional.isCardMove && this.special === "PROMOTION" && this.additional.promotionTo) {
                return `${FILES[Piece.getFile(this.to)] + Piece.getRank(this.to)}+${Piece.getPiece(this.additional.promotionTo)?.shortName}`
            }
            return "ERR";
        }
        let mPiece = Piece.getPiece(this.moving) as GamePiece;

        //Getting strings
        let pieceName = mPiece.shortName === Pawn.shortName ? "" : mPiece.shortName;
        let captureText = this.captured === Piece.None ? "" : "x";
        let destination = Piece.getSquareName( this.to );
        let specification = "";

        if ( this.specify === ActualMove.FILE || this.specify === ActualMove.BOTH ) {
            specification += FILES[Piece.getFile( this.from )];
        }
        if ( this.specify === ActualMove.RANK || this.specify === ActualMove.BOTH ) {
            specification += Piece.getRank( this.from );
        }

        let promotionTo = this.additional && this.additional.promotionTo ? `=${Piece.getPiece(this.additional.promotionTo)?.shortName}` : "";

        return `${ pieceName }${ specification }${ captureText }${ destination }${ promotionTo }`
    }

    constructor( _from : number, _to : number, _moving : number, _captured : number, _specify : number = ActualMove.NONE, _special?: SpecialMove, _additional: Partial<AdditionalOptions> = {}) {

        this.from = _from;
        this.to = _to;
        this.moving = _moving;
        this.captured = _captured;
        this.specify = _specify;
        this.special = _special;
        this.additional = _additional;

    }

}