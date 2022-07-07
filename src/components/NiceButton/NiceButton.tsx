import React, {ReactChild} from "react"
import { Link } from "react-router-dom"
import "./NiceButton.css"

interface NiceButtonProps {
    onClick: string | ( () => void ),
    text: string,
    buttonStyle?: "small" | "medium" | "large",
    disabled?: boolean,
    highlight?: boolean
}

export default function NiceButton({ onClick, text, buttonStyle = "small", disabled = false, highlight = false }:NiceButtonProps) {

    const wrapper = (reactChild:ReactChild) => typeof onClick === "function" ?

        <div className={`niceButtonOuter ${buttonStyle}`} onClick={() => !disabled ? onClick() : null }>
            { reactChild }
        </div>

        :

        <Link to={onClick}>
            <div className={`niceButtonOuter ${buttonStyle}`}>
                {reactChild}
            </div>
        </Link>



    return wrapper( <>

            <div className={`niceButtonBackground ${buttonStyle}`}/>

            <div className={`niceButtonForeground ${buttonStyle} ${ disabled ? "disabled" : "" } ${highlight ? "highlight":""}`}>
                <p>{ text }</p>
            </div>


        </> )

}