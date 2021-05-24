import GamePiece from "../GamePiece";
import {Move} from "../../types";

export default class Queen extends GamePiece {

    //eval
    public static materialValue = 9;

    //naming & display
    public static shortName = "q";
    public static longName = "Queen";

}