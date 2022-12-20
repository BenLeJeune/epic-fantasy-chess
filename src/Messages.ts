///
/// The General Message Class
///
import {GameInfo} from "./types";
import {promotionMove} from "./WebWorker/IncludePromotions";
import {cardMove} from "./WebWorker/MiniMax";

export default abstract class Message {
    public abstract msgType: MessageType
    public abstract payload: any
}

export class ReadyMessage extends Message {
    public msgType =  "ready" as MessageType
    public payload = {}
}

export class SetupChoice_Message extends Message {
    public msgType = "setup_choice" as MessageType
    public payload : {
        choice: "army" | "deck" | "colour",
        data : SetupChoiceData
    }
    constructor(_payload: {
        choice: "army" | "deck" | "colour",
        data : SetupChoiceData
    }) {
        super()
        this.payload = _payload
    }
}

export class GameStartRequest_Message extends Message {
    public msgType = "game_start_request" as MessageType
    public payload: {
        army: {
            name: string,
            pieces: number[]
        },
        deck: {
            name: string,
            cards: string[]
        }
    }
    constructor(_payload: { army: { name: string, pieces: number[] }, deck: { name: string, cards: string[] } }) {
        super();
        this.payload = _payload;
    }
}

export class GameStartResponse_Message extends Message {
    public msgType = "game_start_response" as MessageType;
    public payload: GameInfo
    constructor(_payload: GameInfo) {
        super();
        this.payload = _payload;
    }
}

export class PieceMove_Message extends Message {
    public msgType = "piece_move" as MessageType
    public payload: promotionMove
    constructor(_payload: promotionMove) {
        super();
        this.payload = _payload;
    }
}

export class CardMove_Message extends Message {
    public msgType = "card_move" as MessageType
    public payload: cardMove
    constructor(_payload: cardMove) {
        super();
        this.payload = _payload;
    }
}

export type MessageType = "ready" | "move" | "card" | "setup_choice" | "game_start_request"
    | "piece_move" | "card_move"

type SetupChoiceData = "WHITE" | "BLACK" | "RANDOM" | {
    name: string,
    pieces: number[]
} | {
    name: string,
    cards: string[]
}