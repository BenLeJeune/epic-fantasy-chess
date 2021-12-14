export type Colour = "white" | "black"

export type PieceCategory = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king"

export type SquareFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"

export interface Move {
    from : number,
    to : number,
    piece : number
}

export const FILES = [ "a", "b", "c", "d", "e", "f", "g", "h" ]


export interface legalMove {
    to : number,
    from : number,
    special? : SpecialMove
}

export type SpecialMove =  "EP" | "PROMOTION" | "CASTLE" | "DOUBLE"

export type tag = "Major" | "Minor" | "Castler" | "Colour-bound" | "Knight" | "Bishop" | "Rook" | "Queen" | "King" | "Pawn" | "FIDE" | "Crusader"

export interface GameInfo {
    uuid: string,
    opponent: "LOCAL" | "COMP",
    army: string,
    opponentArmy: string,
    deck: string,
    opponentDeck: string,
    colour: 1 | -1
}