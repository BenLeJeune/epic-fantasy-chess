///
/// IS OPPOSING CAPTURE
///

//Abstracts the logic for whether or not something is a capture of an opposing piece
const isOpposingCapture : ( piece : number, target : number ) => boolean
    = (piece, target) => ( piece > 0 && target < 0 ) || ( piece < 0 && target > 0 );

export {
    isOpposingCapture
}