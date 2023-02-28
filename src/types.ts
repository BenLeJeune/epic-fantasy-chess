///
/// PIECES
///

export type Colour = "white" | "black"

export type PieceCategory = "pawn" | "knight" | "bishop" | "rook" | "queen" | "king"

export type tag = "Major" | "Minor" | "Castler" | "Colour-bound" | "Knight" | "Bishop" | "Rook" | "Queen" | "King" | "Pawn" | "FIDE" | "Crusader" | "Token"

export type SquareFile = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h"

///
/// MOVES
//

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

///
/// USED FOR STORING INFO ABOUT THE GAME
///

export interface GameInfo {
    uuid: string,
    opponent: "LOCAL" | "COMP" | "ONLINE",
    army: string,
    opponentArmy: string,
    deck: string,
    opponentDeck: string,
    colour: 1 | -1
}

export type moveProxy = {
    from: number, to: number, moving: number, captured: number, specify: number, special: SpecialMove | undefined
}

export type effectProxy = {
    square: number, name: string, target: "piece" | "square", duration: number
}

export interface InProgressGameInfo {
    board: number[]
    history: moveProxy[],
    army: number[],
    colour: number[],
    effects: effectProxy[],
    hand: string[],
    options: {}
}