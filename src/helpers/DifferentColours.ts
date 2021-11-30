///
/// IS OPPOSING CAPTURE
///

//Abstracts the logic for whether or not something is a capture of an opposing piece
const differentColours : (piece : number, target : number ) => boolean
    = (piece, target) => ( piece > 0 && target < 0 ) || ( piece < 0 && target > 0 );


const sameColour : ( piece : number, comparison : number ) => boolean
    = (piece, comparison) => ( piece > 0 && comparison > 0 ) || ( piece < 0 && comparison < 0 )

export {
    differentColours,
    sameColour
}