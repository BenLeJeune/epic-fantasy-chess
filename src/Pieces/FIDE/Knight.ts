import GamePiece from "../GamePiece";
import {Move} from "../../types";

export default class Knight extends GamePiece {

    //eval
    public static materialValue = 3;

    //naming & display
    public static shortName = "n";
    public static longName = "Knight";

}