import {Move, SpecialMove} from "../types";
import {generateFIDEBoard} from "../helpers/BoardGenerators";
import ActualMove from "./Move";
import CardMove from "./CardMove";
import Piece from "./Piece";
import Pawn from "../Pieces/FIDE/Pawn";
import Rook from "../Pieces/FIDE/Rook";
import Card from "../Cards/Card";
import ALL_CARDS from "../Cards/Cards";
import Expendable_Card from "../Cards/FIDE/Expendable_Card";
import {Deck, FIDEDECK} from "../Presets/Decks";
import {randomFromList} from "../helpers/Utils";

export default class Game {

    private readonly board : number[]

    private currentTurn : number; //1 for white, -1 for black

    private moves : ( ActualMove | CardMove )[]
    private gameLength : number;

    private pieceIndexes : number[]; //Indexes where there are pieces

    ///
    /// PLAYER DECKS & HANDS
    ///
    private whiteHand : Card[];
    private blackHand : Card[];
    private readonly whiteDeck : Deck;
    private readonly blackDeck : Deck;
    private readonly whiteCurrentDeck : Card[];
    private readonly blackCurrentDeck : Card[];


    public UnMove = () => {
        
        //Let's roll back the most recent move!
        let move = this.moves.pop();

        //
        /// IS THE MOVE IS A NORMAL MOVE, DO THE FOLLOWING
        ///
        if ( move instanceof ActualMove ) {
            this.moves = [ ...this.moves ]
            if ( move === undefined ) return;
    
            let colour = move.moving > 0 ? 1 : -1;
    
            //Let's replace any piece that was captured
            if ( move.special !== "EP" ) {
                this.board[move.to] = move.captured;
                //Update piece indexes
                if ( move.captured !== Piece.None ) this.pieceIndexes.push( move.to )
            }
            this.board[ move.from ] = move.moving;
            //Update piece indexes
            this.pieceIndexes[ this.pieceIndexes.indexOf( move.to ) ] = move.from;
    
            switch ( move.special ) {
                case "EP":
                    this.board[ move.to ] = Piece.None;
                    this.board[ move.to - 8 * colour ] = move.captured;
                    this.pieceIndexes.push( move.to - 8 * colour )
                    break;
                case "PROMOTION":
                    //We should be able to attach the piece we want to promote to
                    break;
                case "CASTLE":
                    //CASTLING RULES
                    //We've already moved the king. Now, we want to move the rook.
    
                    //If we were castling Queenside
                    if ( move.from > move.to ) {
                        let rookDistance = 0;
                        if ( Math.abs(this.board[move.to + 1]) === Piece.Rook) {
                            //CASTLING WITH A SIMPLE ROOK
                            rookDistance = 2; //Rook is 2 after where the king moves to
                        }
                        else if ( Math.abs(this.board[move.to + 1]) === Piece.Bede) {
                            rookDistance = 1; //Bede is only 1 after where the king moves to
                        }
                        let rookSquare = move.to - rookDistance;
                        this.board[rookSquare] = this.board[ move.to + 1 ];
                        this.board[ move.to + 1 ] = Piece.None;
                        //Update pieceIndexes
                        this.pieceIndexes[ this.pieceIndexes.indexOf( move.to + 1 ) ] = rookSquare;
                    }
                    //If we were castling Kingside
                    if ( move.from < move.to ) {
                        let rookSquare = move.to + 1;
                        this.board[rookSquare] = this.board[ move.to - 1 ];
                        this.board[ move.to - 1 ] = Piece.None;
                        this.pieceIndexes[ this.pieceIndexes.indexOf( move.to - 1 ) ] = rookSquare;
                    }
    
                    break;
                case undefined:
                default:
                    break;
            }
            if ( !move.additional.isCardMove ) {
                if (this.currentTurn > 0) this.gameLength-- //If undoing a white move, reduce turn number
                this.currentTurn = -this.currentTurn; //THE NEXT PLAYER'S TURN
            }
            else {
                //IF WE JUST UN-MADE A CARD MOVE
                //Repeat
                this.UnMove();
            }

        }

        ///
        /// IF THE MOVE IS A CARD MOVE, DO THIS INSTEAD!
        ///

        if ( move instanceof CardMove ) {
            //We want to roll back to what the board was before the card move
            this.board.forEach((piece, position) => {
                //If the piece has changed, then we update it
                if ( piece !== (move as CardMove).boardBefore[position] ) {
                    this.board[position] = (move as CardMove).boardBefore[position];
                }
                // If the piece didn't change, don't update it
            })

            //If the card we just un-did wasn't fast, then we change back the turn.
            let card = ALL_CARDS[ move.cardName ];
            if ( card && !card.fast ) {
                if (this.currentTurn > 0) this.gameLength--; //If un-making a white move, reduce the game length counter
                this.currentTurn = -this.currentTurn;
            }
        }

    };

    ///
    /// MAKING A NORMAL CHESS MOVE
    ///
    public Move = ( from : number, to : number, special? : SpecialMove, additional: Partial<AdditionalOptions> = {}) => {
        //Let's add the move function
        //Keeping it simple for now, let's just make the move. Forcefully.

        //Let's see if there is anything special we need to do
        let colour = this.board[from] > 0 ? 1 : -1;
        let specify = ActualMove.NONE;
        let moving = this.board[from];
        let captured = to === from ? Piece.None : this.board[to]; //Not capturing if moving to own square

        if ( Math.abs( this.board[from] ) === Piece.Pawn && this.board[to] !== 0) {
            specify = ActualMove.FILE
        }

        if (captured !== Piece.None) {
            this.pieceIndexes.splice(this.pieceIndexes.indexOf(to), 1)
        }

        //WE ALSO WANT TO HANDLE SPECIAL MOVES
        switch ( special ) {
            case "EP":
                captured = this.board[ to - 8 * colour ];
                this.board[ to - 8 * colour ] = Piece.None;
                //Remove from piece indexes
                this.pieceIndexes.splice( this.pieceIndexes.indexOf( to - 8 * colour ), 1);
                break;
            case "PROMOTION":
                //We should have the piece attached
                if ( additional.hasOwnProperty("promotionTo") && additional.promotionTo !== undefined ) {
                    let { promotionTo } = additional;
                    //Now, we just replace the piece with the one we want to promote to!
                    this.board[ from ] = promotionTo;
                }
                break;
            case "CASTLE":
                //CASTLING RULES
                //We've already moved the king. Now, we want to move the rook.

                //If we're castling Queenside
                if ( from > to ) {
                    let rookSquare = to;
                    if ( Math.abs(this.board[ to - 2 ]) === Piece.Rook && this.board[ to - 1 ] === Piece.None ) {
                        //CASTLING WITH A SIMPLE ROOK
                        rookSquare -= 2; //Rook is 2 after where the king moves to
                    }
                    else if ( Math.abs(this.board[to - 1]) === Piece.Bede) {
                        rookSquare -= 1; //Bede is only 1 after where the king moves to
                    }
                    this.board[ to + 1 ] = this.board[rookSquare];
                    this.board[rookSquare] = Piece.None;
                    //Update piece indexes
                    this.pieceIndexes[ this.pieceIndexes.indexOf( rookSquare ) ] = to + 1
                }
                //If we're castling Kingside
                if ( from < to ) {
                    let rookSquare = to + 1;
                    this.board[ to - 1 ] = this.board[rookSquare];
                    this.board[rookSquare] = Piece.None;
                    //Update piece indexes
                    this.pieceIndexes[ this.pieceIndexes.indexOf( rookSquare ) ] = to - 1
                }

                break;
            case undefined:
            default:
                break;
        }

        this.moves.push( new ActualMove( from, to, moving, captured, specify, special, additional) );

        //Let's move the piece on To to From.
        this.board[to] = this.board[from];
        if (to !== from) this.board[from] = Piece.None;

        //Updater piece indexes
        this.pieceIndexes[ this.pieceIndexes.indexOf( from ) ] = to

        if ( !additional.isCardMove ) {
            if (this.currentTurn < 0) this.gameLength++ //If made a black move, incrementing game length (turn number)
            this.currentTurn = -this.currentTurn;
            this.checkForCardDraw()
        }

    }

    private checkForCardDraw = () => {
        if (this.gameLength % 3 === 0 && this.currentTurn > 0) {
            this.DrawCard(1, 1);
            this.DrawCard(-1, 1);
            console.log("DRAWING CARDS!");
        }
    }

    ///
    /// PLAYING A CARD
    ///
    public PlayCard = ( card: Card, targets: number[] ) => {

        if ( !card ) {
            console.log("Tried to play a card that does not exist!");
            return;
        }

        if (targets.length !== card.targets) {
            console.log("Tried to play a card with the improper amount of targets");
            return;
        }

        //
        // CARD FUNCTIONALITY WORKS VIA CALLBACKS, SO WE USE THE CALLBACK!
        //

        // Save the board state
        let boardBefore = [ ...this.board ];

        //Now we create the card move
        let cardMove = new CardMove( card.id, boardBefore );
        this.moves.push( cardMove );

        card.playCard( targets, this );

        ///
        /// NOW, WE REMOVE THE CARD FROM THE PLAYER'S HAND
        ///

        if (this.currentTurn > 0) {
            let removalIndex = this.whiteHand.map(c => c.getUUID()).indexOf(card.getUUID());
            this.whiteHand = this.whiteHand.filter((c, i) => i !== removalIndex);
        }
        else {
            let removalIndex = this.blackHand.map(c => c.getUUID()).indexOf(card.getUUID());
            this.blackHand = this.blackHand.filter((c, i) => i !== removalIndex);
        }


        //Now, we change the current turn - IF the card was fast.
        if ( !card.fast ) {
            if (this.currentTurn < 0) this.gameLength++;
            this.currentTurn = -this.currentTurn;
            this.checkForCardDraw();
        }

    }

    ///
    /// DRAWING CARDS
    ///
    public DrawCard = ( colour: number, quantity: number = 1 ) => {
        if ( colour > 0 ) {
            //Drawn for white
            for (let i = 0; i < quantity; i++) {
                let drawn = Number.parseInt(randomFromList( Object.keys(this.whiteCurrentDeck) ));
                this.whiteHand.push( this.whiteCurrentDeck[drawn] );
                this.whiteCurrentDeck.filter((c, i) => i !== drawn);
            }
        }
        else {
            //Drawn for black
            for (let i = 0; i < quantity; i++) {
                let drawn = Number.parseInt(randomFromList( Object.keys(this.blackCurrentDeck) ));
                this.blackHand.push( this.blackCurrentDeck[drawn] );
                this.blackCurrentDeck.filter((c, i) => i !== drawn);
            }
        }
    }


    constructor( _board : number[] = generateFIDEBoard(), _history : ActualMove[] = [], _whiteDeck: Deck = FIDEDECK, _blackDeck: Deck = FIDEDECK  ) {
        this.board = [..._board]
        this.moves = _history;
        this.currentTurn = 1;
        this.gameLength = 1;

        let _pieceIndexes = [] as number[];
        [ ..._board ].forEach((piece, i) => {
            if (piece !== Piece.None) _pieceIndexes.push(i);
        })
        this.pieceIndexes = _pieceIndexes;

        this.whiteHand = [];
        this.blackHand = [];
        this.whiteDeck = _whiteDeck;
        this.blackDeck = _blackDeck;
        this.whiteCurrentDeck = this.whiteDeck.cards.map(c => {
            let _c = Object.assign({}, ALL_CARDS[c]);
            _c.regenerateUUID();
            return _c;
        });
        this.blackCurrentDeck = this.blackDeck.cards.map(c => {
            let _c = Object.assign({}, ALL_CARDS[c]);
            _c.regenerateUUID();
            return _c;
        });

        //DRAWING THE INITIAL CARDS
        this.DrawCard(1, 2); //Draw 2 cards for white
        this.DrawCard(-1, 3); //Draw 3 cards for black

        // FOR DEVELOPMENT PURPOSES
        if (global.window) ( global.window as any ).updateBoard = ( update:(board:number[])=>number[] ) => update(this.board).map((p, i) => this.board[i] = p);

    }

    public getBoard = () => this.board;
    public getMoves = () => this.moves;
    public getCurrentTurn = () => this.currentTurn;
    public getPieceIndexes = () => this.pieceIndexes;

    public getWhiteHand = () => this.whiteHand;
    public getBlackHand = () => this.blackHand;
    public getCurrentPlayerHand = () => this.currentTurn > 0 ? this.whiteHand : this.blackHand;

    public getLastMove = () => this.moves.length > 0 ? this.moves[ this.moves.length - 1 ] : undefined;

    ///
    /// FOR PLAYING CARDS
    /// We want to be able to directly access the game board, so we'll do this
    ///

    public updateGameBoard : ( callback : ( board: number[] ) => void ) => void = ( callback : (board:number[]) => void ) => callback( this.board );

}

export interface AdditionalOptions {
    promotionTo : number,
    isCardMove: boolean
}