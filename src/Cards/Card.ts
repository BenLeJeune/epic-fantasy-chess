import ActualMove from "../Classes/Move";
import Game from "../Classes/Game";

export default abstract class Card {

    //This class will be used for storing data about cards
    //It will never be directly instantiated, hence abstract

    ///
    /// NAMING & DISPLAYING
    ///
    public abstract cardName : string; //e.g "Expendable"
    public abstract description: string; //e.g "Summon a pawn."

    ///
    /// TARGETING & RESOLVING
    ///
    public abstract targets: number; //e.g 2

    // Returns an array of all valid target indexes
    public abstract getValidTargets : ( board : number[], colour: number, history: ActualMove[] ) => number[]

    // Resolves the playing of the card
    public abstract playCard : ( targets: number[], board: number[], colour: number, game: Game ) => void;

}