import GamePiece from "../GamePiece";
import {Move} from "../../types";

export default class Bishop extends GamePiece {

    //eval
    public static materialValue = 3;

    //naming & display
    public static shortName = "b";
    public static longName = "Bishop";

}