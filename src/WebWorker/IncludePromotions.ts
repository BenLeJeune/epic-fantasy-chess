import {legalMove} from "../types";
import Piece from "../Classes/Piece";
import {AdditionalOptions} from "../Classes/Game";

///
/// ADDS PROMOTIONS TO A LIST OF LEGAL MOVES
///

const filterPromotionPieces = ( army : number[], colour : 1 | -1 ) => {
    //We want to remove duplicates
    let filtered = army.reduce(( acc, cur ) => acc.indexOf( cur ) === -1 ? [ ...acc, cur ] : acc, [] as number[]);
    return filtered.filter( piece => Math.abs(piece) !== Piece.King ).sort( (a, b) => a - b ).map( piece => colour > 0 ? piece : -piece )
}

export type promotionMove = {
    move: legalMove,
    additional?: Partial<AdditionalOptions>
}

const includePromotion = ( board:number[], legalMoves : legalMove[], army: number[], colour: 1 | -1 ) => legalMoves.map( move => {
    let validPromotionPieces = filterPromotionPieces(army, colour);
    if ( board[ move.from ] === ( -1 ) * Piece.Pawn && ( move.to < 8 || move.to > 55 ) ) {
        //Promotions
        let promotions = [] as promotionMove[]
        for ( let promotionTo of validPromotionPieces ) {
            promotions.push( { move: Object.assign( { special: "PROMOTION" }, move ), additional: { promotionTo } } )
        }
        return promotions;
    }
    else {
        //Everything else
        return { move } as promotionMove
    }
} ).reduce<promotionMove[]>(
    ( acc, next ,) => {
        if ( Array.isArray(next) ) return [ ...acc, ...next ]
        else return [ ...acc, next ]
    }, [] as promotionMove[]
)

export default includePromotion