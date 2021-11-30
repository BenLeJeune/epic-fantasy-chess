import CardMove from "../Classes/CardMove";
import ActualMove from "../Classes/Move";

const ActualMoves = ( moves : (ActualMove | CardMove)[] ) => moves.filter( m => m instanceof ActualMove ) as ActualMove[];

const CardMoves = ( moves: ( ActualMove | CardMove )[] ) => moves.filter( m => m instanceof CardMove ) as CardMove[];

export {
    ActualMoves,
    CardMoves
}