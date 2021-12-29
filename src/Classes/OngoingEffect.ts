

export default class OngoingEffect {

    private affecting : number
    private name: string
    private durationRemaining: number
    private toolTip: string
    private target: "square" | "piece"

    public constructor(_affecting: number, _name: string, _duration: number, _toolTip: string, _target: "square" | "piece" = "piece") {
        this.affecting = _affecting;
        this.name = _name;
        this.durationRemaining = _duration;
        this.toolTip = _toolTip;
        this.target = _target;
    }

    public getSquare = () => this.affecting;
    public getName = () => this.name;
    public getDurationRemaining = () => this.durationRemaining;
    public getToolTip = () => this.toolTip;
    public getTarget = () => this.target;

    public updateSquare = ( _square: number ) => this.affecting = _square;

    public tickDownDuration = () => this.durationRemaining--;
    public unTickDuration = () => this.durationRemaining++;

}