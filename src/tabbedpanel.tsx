import React, {ReactNode, useState} from "react";
import {toClass} from "./index";
import "./tabbedpanel.css"
export function TabbedPanel(props: { titles:string[], children:ReactNode}) {
    let [selected, set_selected] = useState(()=>props.titles[0])
    let child = null
    if(Array.isArray(props.children)) {
        child = props.children[props.titles.indexOf(selected)]
    }

    return <div className={"tabbed-pane"}>
        <div className={"tab-titles"}>{props.titles.map(title => <button
            className={toClass({"tab-title":true, selected:selected===title})}
            key={title} onClick={()=>set_selected(title)}
        >{title}</button>)}</div>
        <div className={"tab-content"}>
            {child?child:"empty"}
        </div>
    </div>
}
