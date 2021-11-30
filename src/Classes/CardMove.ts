import ALL_CARDS from "../Cards/Cards";

export default class CardMove {

    public readonly cardName : string;

    public readonly boardBefore : number[];

    public getMoveName : () => string = () => ALL_CARDS[ this.cardName ].shortName

    constructor( _cardName : string, _boardBefore : number[] ) {
        this.cardName = _cardName;
        this.boardBefore = _boardBefore;
        if ( Object.keys(ALL_CARDS).indexOf(_cardName) === -1 ) {
            console.log("Warning - creating a CardMove using a non-existant card!")
        }
    }

}