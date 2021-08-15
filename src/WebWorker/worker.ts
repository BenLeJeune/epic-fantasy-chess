import { expose } from 'comlink';
import { moveGenerator as MoveGenerator, beginBackgroundEvaluation as BeginBackgroundEvaluation, endBackgroundEvaluation as EndBackgroundEvaluation} from "./MoveGenerator";

const worker = {
    MoveGenerator,
    BeginBackgroundEvaluation,
    EndBackgroundEvaluation
};

export type OpponentWebWorker = typeof worker;

expose(worker);