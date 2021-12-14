import Expendable_Card from "../Cards/FIDE/Expendable_Card";
import Advance_Card from "../Cards/FIDE/Advance_Card";
import TacticalRetreat_Card from "../Cards/FIDE/TacticalRetreat_Card";
import Reposition_Card from "../Cards/FIDE/Reposition_Card";
import Mount_Card from "../Cards/FIDE/Mount_Card";
import Demote_Card from "../Cards/FIDE/Demote_Card";
import Maneuver_Card from "../Cards/FIDE/Maneuver_Card";
import Flee_Card from "../Cards/FIDE/Flee_Card";
import Promotion_Card from "../Cards/FIDE/Promotion_Card";

export class Deck {

    cards: string[]

    name: string

    constructor( _cards:string[], _name:string ) {
        this.cards = _cards;
        this.name = _name;
    }

}

export const FIDEDECK = new Deck([
    Advance_Card.id,
    Advance_Card.id,
    Expendable_Card.id,
    Expendable_Card.id,
    TacticalRetreat_Card.id,
    TacticalRetreat_Card.id,
    Reposition_Card.id,
    Reposition_Card.id,
    Mount_Card.id,
    Mount_Card.id,
    Demote_Card.id,
    Demote_Card.id,
    Maneuver_Card.id,
    Flee_Card.id,
    Promotion_Card.id
], "FIDE Deck");