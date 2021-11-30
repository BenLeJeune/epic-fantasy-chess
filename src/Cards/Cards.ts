import Card from "./Card";
import Expendable_Card from "./FIDE/Expendable";

const ALL_CARDS : { [ cardId : string ] : Card } = {
    [Expendable_Card.id]: new Expendable_Card()
};

export default ALL_CARDS;