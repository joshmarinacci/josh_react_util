import React, {createContext, ReactNode, useContext, useEffect, useState} from "react"
import {Point} from "josh_js_util"

import "./index.css"


/*
- [ ] simple Dark and light themes with css variables
- [x] vbox and hbox with child prop propagation
- [ ] main fill panel to completely fill the browser
- [ ] popup and dialog
- [ ] properly scaled canvas with a drawing delegate
- [ ] simple auto scaling continuous chart
- [ ] Tab panel. N children and array of titles
- [ ] verify I can import it into another project

 */
export function Spacer() {
    return <span className={"spacer"}/>
}
export function toClass(param: object):string {
    return Object.entries(param)
        .filter(([,v])=>v)
        .map(([k])=>k)
        .join(" ")
}

export function HBox(props: { children: ReactNode, className?:string }) {
    let cls = toClass({
        hbox:true,
        [props.className]:(!!props.className),
    })
    return <div className={cls} {...props}>{props.children}</div>
}

export function VBox(props: { children: ReactNode, className?:string }) {
    let cls = toClass({
        vbox:true,
        [props.className]:(!!props.className),
    })
    return <div className={cls} {...props}>{props.children}</div>
}

export function FillPage(props: { children: ReactNode, className?:string }) {
    let cls = toClass({
        'fill-page':true,
        [props.className]:(!!props.className),
    })
    return <div className={cls}>{props.children}</div>
}

export function WrapBox(props: {children: ReactNode, className?:string}) {
    let cls = toClass({
        wrapbox:true,
        [props.className]:(!!props.className),
    })
    return <div className={cls} {...props}>{props.children}</div>
}

export * from "./datagrid"
export * from "./dialog"
export * from "./popup"
export * from "./tabbedpanel"
