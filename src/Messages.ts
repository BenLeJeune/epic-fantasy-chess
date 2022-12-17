///
/// The General Message Class
///
export default abstract class Message {
    public abstract msgType: MessageType
    public abstract payload: any
}

export class WaitingFor_Message extends Message {
    public msgType =  "waiting_for" as MessageType
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

export type MessageType = "waiting_for" | "move" | "card" | "setup_choice"

type SetupChoiceData = "WHITE" | "BLACK" | "RANDOM" | {
    name: string,
    pieces: number[]
} | {
    name: string,
    cards: string[]
}