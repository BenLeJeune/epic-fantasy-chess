import React, {ReactChild} from "react"
import { Link } from "react-router-dom"
import "./NiceButton.css"

interface NiceButtonProps {
    onClick: string | ( () => void ),
    text: string,
    buttonStyle?: "small" | "medium" | "large"
}

export default function NiceButton({ onClick, text, buttonStyle = "small" }:NiceButtonProps) {

    const wrapper = (reactChild:ReactChild) => typeof onClick === "function" ?

        <div className={`niceButtonOuter ${buttonStyle}`} onClick={onClick}>
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

            <div className={`niceButtonForeground ${buttonStyle}`}>
                <p>{ text }</p>
            </div>


        </> )

}