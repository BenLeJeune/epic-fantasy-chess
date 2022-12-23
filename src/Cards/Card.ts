import ActualMove from "../Classes/Move";
import Game from "../Classes/Game";
import { v4 as generateUUID } from "uuid";
import {generateUniqueID} from "web-vitals/dist/modules/lib/generateUniqueID";
import OngoingEffect from "../Classes/OngoingEffect";

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

    public abstract readonly expac: string

    ///
    /// TARGETING & RESOLVING
    ///
    public abstract readonly targets: number; //the number of targets the card expects
    public abstract readonly fast: boolean; //true/false
    public abstract readonly cost: number; //chaos cost

    ///
    /// UNMOVING
    ///
    public abstract unMoveType: "boardState" | "move"; // "boardState" means the board state is reverted on unMove. "move" means the card makes a regular move.

    // Returns an array of all valid target indexes
    public abstract getValidTargets : (( board : number[], colour: number, history: ActualMove[], previousTargets?: number[], effects?: OngoingEffect[]) => number[])[]

    // Resolves the playing of the card
    public abstract playCard : ( targets: number[], game: Game ) => void;

    // Tracks pieces moved by the card. Only needed for cards that move pieces in non-conventional ways (e.g swapping)
    public trackPiece : ( square : number, targets: number[] ) => number = square => square;


    //
    /// TRACKING THE CARD
    ///
    private uuid: string = generateUUID();
    public getUUID = () => this.uuid;
    public getUUIDWithInfo = () => `${this.id}::${this.uuid}`
    public regenerateUUID = () => this.uuid = generateUUID()

}