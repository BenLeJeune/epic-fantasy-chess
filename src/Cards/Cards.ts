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

const ALL_CARDS : { [ cardId : string ] : Card } = {
    // [Advance_Card.id]: new Advance_Card(),
    // [Expendable_Card.id]: new Expendable_Card(),
    // [TacticalRetreat_Card.id]: new TacticalRetreat_Card(),
    // [Reposition_Card.id]: new Reposition_Card(),
    [Mount_Card.id]: new Mount_Card(),
    [Demote_Card.id]: new Demote_Card(),
    [Maneuver_Card.id]: new Maneuver_Card(),
    [Flee_Card.id]: new Flee_Card(),
    [Promotion_Card.id]: new Promotion_Card(),

};

export default ALL_CARDS;