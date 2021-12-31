///
/// CHECKS
///

import Piece from "../Classes/Piece";
import {legalMove, Move} from "../types";
import ActualMove from "../Classes/Move";
import Board from "../Classes/Board";
import Game from "../Classes/Game";
import OngoingEffect from "../Classes/OngoingEffect";
import {sameColour} from "./DifferentColours";
import CardMove from "../Classes/CardMove";
import ALL_CARDS from "../Cards/Cards";
import {getActualMoves} from "./MoveFilter";

///
/// IS THIS COLOUR'S KING IN CHECK?
const isCheck : ( board:number[], history:ActualMove[], colour: number, legalMoves?: legalMove[] ) => boolean = ( board, history, colour, legalMoves ) => {

    //Determine the king's square

    let wKing = board.indexOf( Piece.King );
    let bKing = board.indexOf( -Piece.King );

    if ( wKing === -1 || bKing === -1) return false;

    let pos = colour > 0 ? wKing : bKing;

    if (!legalMoves) legalMoves = Board.getLegalMoves(
        board, history, { mode: "captures", colour: -colour } )

    //Are there any attacks on the king?
    return legalMoves.filter( move => move.to === pos ).length > 0;

}

const filterCardMoves : ( g:Game, id:string, targets:number[], colour:number)=>boolean = ( g, id, targets, colour) => {

    let _g = new Game( g.getBoard(), getActualMoves(g.getMoves()), g.getWhiteDeck(), g.getBlackDeck() )
    g.getCurrentOngoingEffects().forEach(
        e => _g.addOngoingEffect( new OngoingEffect( e.getSquare(), e.getName(), e.getDurationRemaining(), "", e.getTarget() ) )
    )

    let stillInCheck = false;
    let card = ALL_CARDS[id];
    if (targets.length === card.targets) {
        //WE HAVE ENOUGH TARGETS ALREADY
        _g.PlayCard( ALL_CARDS[id], targets );
        stillInCheck = isCheck( _g.getBoard(), getActualMoves(_g.getMoves()), colour );
        _g.UnMove();
    }
    else {
        //SEE IF THERE ARE ANY LEGAL TARGETS FOR THE SUBSEQUENT MOVE
        let subsequentPossibleTargets = card.getValidTargets[0]( _g.getBoard(), colour, getActualMoves(_g.getMoves()), targets, _g.getCurrentOngoingEffects() );
        let arePossibleMoves = subsequentPossibleTargets.reduce(( validTargets, current ) => {
            return filterCardMoves( _g, id, [ ...targets, current ], colour ) || validTargets;
        }, false)
        stillInCheck = !arePossibleMoves
    }
    return !stillInCheck
}

const filterLegalMoves : ( moves: legalMove[], board : number[], history:ActualMove[], colour : number, effects : OngoingEffect[] ) => legalMove[]
    = ( moves, board, history, colour, effects ) => {

    let game = new Game( board , history );
    effects.forEach( effect => game.addOngoingEffect( new OngoingEffect( effect.getSquare(), effect.getName(), effect.getDurationRemaining(), effect.getToolTip(), effect.getTarget() ) ) );

    let filtered = moves.filter( move => {

        //ONGOING EFFECTS

        // HALLOW SPELL
        if ( effects.filter(e => e.getName() === "no-captures").filter( e => e.getSquare() === move.from && board[move.to] !== Piece.None ).length > 0 ) return false //trying to capture (cannot capture)
        if ( effects.filter( e => e.getName() === "no-captures" ).filter( e => e.getSquare() === move.to && board[move.to] !== Piece.None ).length > 0 ) return false //is being captured (cannot be captured)

        // REPENT SPELL
        if ( effects.filter(e => e.getName() === "no-moves").filter( e => e.getSquare() === move.from ).length > 0 ) return false //trying to move (cannot move)

        // OUST SPELL
        let oustEffects = effects.filter(e => e.getName() === "must-move").filter( e => e.getSquare() !== move.from && sameColour( colour, board[e.getSquare()] ) )
        if ( oustEffects.length > 0 ) {

            //MAKE SURE THE PIECE CAN MAKE A LEGAL MOVE!
            let piece = board[oustEffects[0].getSquare()];
            let pieceObj = Piece.getPiece(piece);
            if (pieceObj) {
                let pieceMoves = pieceObj.getLegalMoves( oustEffects[0].getSquare(), board, "all", colour, history );
                //WE WANT TO PREVENT A SCENARIO WHERE THE KING IS CHECKED USING THIS CARD
                let pieceCanMove = pieceMoves.reduce(( validMoveExists, m ) => {
                    if (validMoveExists) return true;
                    game.Move( m.from, m.to, m.special );
                    let stillInCheck = isCheck( game.getBoard(), game.getMoves().filter( mv => mv instanceof ActualMove ) as ActualMove[], colour );
                    game.UnMove();
                    return !stillInCheck || validMoveExists
                }, false)
                if (pieceCanMove) return false;
            }
        }

        //THERE ARE SOME SPECIAL RULES FOR SPECIAL MOVES
        if ( move.special === "CASTLE") {
            if ( isCheck( game.getBoard(), history, colour ) ) return false; //Cannot castle out of check
            let kingsRook = colour > 0 ? 7 : 63;
            let queensRook = colour > 0 ? 0 : 56;
            if ( move.to === kingsRook - 1 && Board.isThreatened( kingsRook - 2, game.getBoard(), history, -colour )) return false;
            if ( move.to === queensRook + 2 && Board.isThreatened( queensRook + 3, game.getBoard(), history, -colour ) ) return false;
        }

        //First, let's make the move.
        game.Move( move.from, move.to, move.special );
        //Now, let's see if there is a check.
        let stillInCheck = isCheck( game.getBoard(), game.getMoves().filter( m => m instanceof ActualMove ) as ActualMove[], colour );
        //Then, we unmake the move.
        game.UnMove();
        return !stillInCheck;
    } )

    return filtered

}

export {
    isCheck,
    filterLegalMoves,
    filterCardMoves
}

