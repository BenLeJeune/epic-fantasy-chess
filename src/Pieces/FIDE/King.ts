import GamePiece from "../GamePiece";
import {Move} from "../../types";

export default class King extends GamePiece {

    //eval
    public static materialValue = 999;

    //naming & display
    public static shortName = "k";
    public static longName = "Knight";

}