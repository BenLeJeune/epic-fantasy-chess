import Piece from "../Classes/Piece";
import {arraysAreEqual} from "../helpers/Utils";

const BOARD = 0, EVAL = 1, TURN = 2, QUIET = 3;
export default class transpositionTable {


    table : [ number[], number, number, boolean ][][];
    size : number;

    constructor() {
        this.table = new Array(4999); //A prime number
        this.size = 0;
    }

    //This is for hashing the positions
    hash( board: number[] ) {
        let arrayHash = [...board].map( (p, i) => [...(p * i).toString()].reduce((acc, next) => acc + next.charCodeAt(0), 0));
        return arrayHash.reduce((a, n) => a + n) % 4999;
    }

    set( board: number[], evaluation: number, turnNumber : number, quiet : boolean ) {
        const index = this.hash(board);
        if (this.table[index]) {
            //If the index already exists
            for ( let pairIndex in this.table[index] ) {
                //Loop over the pairs at that index
                //If we find a match=
                if ( arraysAreEqual( board, this.table[index][pairIndex][BOARD] ) ) {
                    this.table[index][pairIndex] = [[...board], evaluation, turnNumber, quiet]; //was storing at this.table[index][EVAL], where EVAL = 1
                    return;
                }
            }
            //No existing element, push a new pair
            this.table[index].push([[...board], evaluation, turnNumber, quiet]);
            return;
        }
        this.table[index] = [[[...board], evaluation, turnNumber, quiet]];
        this.size++;
    }

    get( board: number[] ) : [number, number, boolean] | null {
        const index = this.hash(board);
        if (this.table[index]) {
            for ( let pair of this.table[index] ) {
                //Loop through possible matches
                if ( arraysAreEqual( board, pair[BOARD] ) ) {
                    return [ pair[EVAL], pair[TURN], pair[QUIET] ]
                }
            }
        }
        //If all else fails,
        return null;
    }
}