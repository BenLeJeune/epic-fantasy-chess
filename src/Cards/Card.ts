import ActualMove from "../Classes/Move";
import Game from "../Classes/Game";

export default abstract class Card {

    //This class will be used for storing data about cards
    //It will never be directly instantiated, hence abstract

    ///
    /// NAMING & DISPLAYING
    ///
    public abstract readonly cardName: string; //e.g "Expendable"
    public abstract readonly shortName: string; //e.g "_Exp" (Begin Card moves with a _)
    public abstract readonly description: string; //e.g "Summon a pawn."
    public static readonly id: string;
    public abstract readonly id: string;

    ///
    /// TARGETING & RESOLVING
    ///
    public abstract readonly targets: number; //the number of targets the card expects
    public abstract readonly fast: boolean; //true/false

    ///
    /// UNMOVING
    ///
    public abstract unMoveType: "boardState" | "move"; // "boardState" means the board state is reverted on unMove. "move" means the card makes a regular move.

    // Returns an array of all valid target indexes
    public abstract getValidTargets : ( board : number[], colour: number, history: ActualMove[] ) => number[]

    // Resolves the playing of the card
    public abstract playCard : ( targets: number[], game: Game ) => void;

}