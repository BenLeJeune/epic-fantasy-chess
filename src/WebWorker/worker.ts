import { expose } from 'comlink';
import MoveGenerator from "./MoveGenerator";

const worker = {
    MoveGenerator
};

export type OpponentWebWorker = typeof worker;

expose(worker);