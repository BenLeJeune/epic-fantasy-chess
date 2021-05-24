import {Move} from "../types";

export default abstract class GamePiece {

    //This class will be used for storing data about chess pieces.
    //It will never be instantiated, but will be used
    //Would be static class if js had these

    ///
    /// EVALUATION
    ///
    public static engineValue : number; //adjusted based on engine evaluation
    public static materialValue : number; //e.g 3
    public static valueGrid : number[]; //A multiplier for each position
    public static evaluate : ( position : number ) => number; //A function to evaluate

    ///
    /// NAMING & DISPLAYING
    ///
    public static shortName : string; //e.g "k"
    public static longName : string; //e.g "Pawn"

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