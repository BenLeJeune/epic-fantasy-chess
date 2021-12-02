import Piece from "../Classes/Piece";

const adjacentSquares = ( i: number, corners: boolean = true ) => {
    let adj = [] as number[];
    let r = Piece.getRank(i), f = Piece.getFile(i);
    if (r <= 6 ) {
        adj.push(i + 8); /// ABOVE
        if (corners) {
            if (f >= 1) adj.push(i+7) //ABOVE-LEFT
            if (f <= 6) adj.push(i+9) //ABOVE-RIGHT
        }
    }
    if (r >= 1 ) { ///
        adj.push(i - 8); /// BELOW
        if (corners) {
            if (f >= 1) adj.push(i-9) //BELOW-LEFT
            if (f <= 6) adj.push(i-7) //BELOW-RIGHT
        }
    }
    if (f >= 1) adj.push(i-1) //LEFT
    if (f <= 6) adj.push(i+1);

    return adj
}

export {
    adjacentSquares
}