import Expendable_Card from "../Cards/FIDE/Expendable_Card";
import Advance_Card from "../Cards/FIDE/Advance_Card";
import TacticalRetreat_Card from "../Cards/FIDE/TacticalRetreat_Card";
import Reposition_Card from "../Cards/FIDE/Reposition_Card";
import Mount_Card from "../Cards/FIDE/Mount_Card";
import Demote_Card from "../Cards/FIDE/Demote_Card";
import Maneuver_Card from "../Cards/FIDE/Maneuver_Card";
import Flee_Card from "../Cards/FIDE/Flee_Card";
import Promotion_Card from "../Cards/FIDE/Promotion_Card";
import Adjust_Card from "../Cards/CRUSADERS/Adjust_Card";
import Inquisition_Card from "../Cards/CRUSADERS/Inquisition_Card";
import Hallow_Card from "../Cards/CRUSADERS/Hallow_Card";
import Repent_Card from "../Cards/CRUSADERS/Repent_Card";
import Oust_Card from "../Cards/CRUSADERS/Oust_Card";
import Envoy_Card from "../Cards/CRUSADERS/Envoy_Card";
import Anoint_Card from "../Cards/CRUSADERS/Anoint_Card";
import Deception_Card from "../Cards/CRUSADERS/Deception_Card";
import Clergy_Card from "../Cards/CRUSADERS/Clergy_Card";
import Convert_Card from "../Cards/CRUSADERS/Convert_Card";
import BattlePlan_Card from "../Cards/FIDE/BattlePlan_Card";

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
    BattlePlan_Card.id,
    Maneuver_Card.id,
    Flee_Card.id,
    Promotion_Card.id
], "FIDE Deck");

export const CRUSADERSDECK = new Deck([
    Adjust_Card.id,
    Adjust_Card.id,
    Inquisition_Card.id,
    Inquisition_Card.id,
    Hallow_Card.id,
    Hallow_Card.id,
    Repent_Card.id,
    Repent_Card.id,
    Oust_Card.id,
    Oust_Card.id,
    Envoy_Card.id,
    Anoint_Card.id,
    Deception_Card.id,
    Clergy_Card.id,
    Convert_Card.id
], "Colourbound Crusaders Deck");

export const DEV_DECK = new Deck([
    Reposition_Card.id,
    Reposition_Card.id,
    Deception_Card.id,
    Deception_Card.id,
], "FIDE Deck");