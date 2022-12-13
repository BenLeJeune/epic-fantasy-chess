///
/// The General Message Class
///
export default abstract class Message {
    public abstract msgType: ChessMessage
}

export class WaitingFor_Message extends Message {
    public msgType =  "waiting_for" as ChessMessage
}

export type ChessMessage = "waiting_for" | "move" | "card"