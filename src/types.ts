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