import GamePiece from "../GamePiece";
import {Move} from "../../types";

export default class Pawn extends GamePiece {

    //eval
    public static materialValue = 1;

    //naming & display
    public static shortName = "p";
    public static longName = "Pawn";
}