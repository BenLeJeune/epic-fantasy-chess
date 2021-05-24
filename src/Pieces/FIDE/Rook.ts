import GamePiece from "../GamePiece";
import {Move} from "../../types";

export default class Rook extends GamePiece {

    //eval
    public static materialValue = 5;

    //naming & display
    public static shortName = "r";
    public static longName = "Rook";

}