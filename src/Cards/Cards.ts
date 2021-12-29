import Card from "./Card";
import Expendable_Card from "./FIDE/Expendable_Card";
import Advance_Card from "./FIDE/Advance_Card";
import TacticalRetreat_Card from "./FIDE/TacticalRetreat_Card";
import Reposition_Card from "./FIDE/Reposition_Card";
import Mount_Card from "./FIDE/Mount_Card";
import Demote_Card from "./FIDE/Demote_Card";
import Maneuver_Card from "./FIDE/Maneuver_Card";
import Flee_Card from "./FIDE/Flee_Card";
import Promotion_Card from "./FIDE/Promotion_Card";
import BattlePlan_Card from "./FIDE/BattlePlan_Card";
import Adjust_Card from "./CRUSADERS/Adjust_Card";
import Inquisition_Card from "./CRUSADERS/Inquisition_Card";
import Anoint_Card from "./CRUSADERS/Anoint_Card";
import Deception_Card from "./CRUSADERS/Deception_Card";
import Clergy_Card from "./CRUSADERS/Clergy_Card";
import Convert_Card from "./CRUSADERS/Convert_Card";
import Envoy_Card from "./CRUSADERS/Envoy_Card";
import Hallow_Card from "./CRUSADERS/Hallow_Card";
import Repent_Card from "./CRUSADERS/Repent_Card";
import Oust_Card from "./CRUSADERS/Oust_Card";

const ALL_CARDS : { [ cardId : string ] : Card } = {
    [Advance_Card.id]: new Advance_Card(),
    [Expendable_Card.id]: new Expendable_Card(),
    [TacticalRetreat_Card.id]: new TacticalRetreat_Card(),
    [Reposition_Card.id]: new Reposition_Card(),
    [Mount_Card.id]: new Mount_Card(),
    [Demote_Card.id]: new Demote_Card(),
    [BattlePlan_Card.id]: new BattlePlan_Card(),
    [Maneuver_Card.id]: new Maneuver_Card(),
    [Flee_Card.id]: new Flee_Card(),
    [Promotion_Card.id]: new Promotion_Card(),
    [Adjust_Card.id]: new Adjust_Card(),
    [Inquisition_Card.id]: new Inquisition_Card(),
    [Hallow_Card.id]: new Hallow_Card(),
    [Repent_Card.id]: new Repent_Card(),
    [Oust_Card.id]: new Oust_Card(),
    [Envoy_Card.id]: new Envoy_Card(),
    [Anoint_Card.id]: new Anoint_Card(),
    [Deception_Card.id]: new Deception_Card(),
    [Clergy_Card.id]: new Clergy_Card(),
    [Convert_Card.id]: new Convert_Card()
};

export const TEST_HAND = [
    new Adjust_Card(),
    new Inquisition_Card(),
    new Envoy_Card(),
    new Hallow_Card(),
    new Repent_Card(),
    new Oust_Card()
]

export default ALL_CARDS;