import "./InformationBubble.css";
import React from "react";

interface props {
    title: string
}

export default function InformationBubble({ title }: props) {

    return <div title={title} className="info-circle">
        ?
    </div>

}