import {Move} from "../types";

export default abstract class GamePiece {

    //This class will be used for storing data about chess pieces.
    //It will never be instantiated, but will be used
    //Would be static class if js had these

    ///
    /// EVALUATION
    ///
    public abstract engineValue : number; //adjusted based on engine evaluation
    public abstract materialValue : number; //e.g 3
    public abstract valueGrid : number[]; //A multiplier for each position
    public abstract evaluate : ( position : number ) => number; //A function to evaluate

    ///
    /// NAMING & DISPLAYING
    ///
    public abstract shortName : string; //e.g "k"
    public abstract longName : string; //e.g "Pawn"

    public getLegalMoves : ( position : number,  board : number[], mode : "all" | "moves" | "captures", colour : number) => legalMove[] =
        ( position, board, mode, colour = 1 ) => {
            return board.map( ( p, square ) => {
                if ( square !== position && p === 0) return {
                    from : position,
                    to : square,
                };
                else return null;
            } ).filter( m => m !== null ) as legalMove[];

        };
}

export interface legalMove {
    to : number,
    from : number
}