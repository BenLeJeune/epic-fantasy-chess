import {SquareFile} from "../../types";
import {FILES} from "../../constants/consts";
import "./ChessSquare.css";

interface props {
    file : number,
    rank : number
}

export default function ChessSquare( { file, rank } : props ) {

    const getStyle = () => {
        if ( ( (7 * rank) + file ) % 2 === 1 ) return "light";
        else return "dark"
    }

    const getLabel = () => {
        const labels = [];
        if ( rank === 1 ) { //We show the file if on the first rank
            labels.push( <div className="sqLabel bottom" key="file">{ FILES[file - 1] }</div> )
        }
        if ( file === 1 ) { //And we show the rank if on the first file
            labels.push( <div className="sqLabel left" key="rank">{rank}</div> )
        }

        return labels;
    }

    return <div className={`chessSquare ${ getStyle() }`} id={ `square-${ FILES[file - 1] }${ rank }` }>
        {
            getLabel()
        }
    </div>

}