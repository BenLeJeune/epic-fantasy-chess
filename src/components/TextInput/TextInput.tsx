import React from 'react';
import "./TextInput.css";

type Props = {
    text: string,
    onChange: ( e : React.ChangeEvent<HTMLInputElement> ) => void
}

export default function TextInput({text, onChange}:Props) {

    return <div className="textInput">
        <div className="scrollContainer">
            <input type="text" value={text} onChange={e => onChange(e)}/>
        </div>
    </div>

}