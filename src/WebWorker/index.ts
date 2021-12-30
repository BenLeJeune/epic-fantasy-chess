import { expose } from 'comlink';
import { moveGenerator , beginBackgroundEvaluation, endBackgroundEvaluation} from "./MoveGenerator";

const worker = {
    moveGenerator,
    beginBackgroundEvaluation,
    endBackgroundEvaluation
};

export type opponentWebWorker = typeof worker;

expose(worker);