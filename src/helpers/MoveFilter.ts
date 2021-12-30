import CardMove from "../Classes/CardMove";
import ActualMove from "../Classes/Move";

const getActualMoves = (moves : (ActualMove | CardMove)[] ) => moves.filter(m => m instanceof ActualMove ) as ActualMove[];

const getCardMoves = (moves: ( ActualMove | CardMove )[] ) => moves.filter(m => m instanceof CardMove ) as CardMove[];

export {
    getActualMoves,
    getCardMoves
}