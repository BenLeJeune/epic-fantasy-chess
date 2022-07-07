import React from 'react';
import "./TextCopy.css";

type Props = {
    text: string
}

export default function TextCopy({text}:Props) {

    const onClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(text);
    }

    return <div title="Click to Copy" className="textCopy" onClick={e => onClick(e)}>
        <div className="scrollContainer">
            {text}
        </div>
        <div className="icon">
            <span className="material-symbols-outlined">
                content_copy
            </span>
            <div className="background"/>
        </div>
    </div>

}