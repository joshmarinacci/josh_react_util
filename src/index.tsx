import React, {ReactNode} from "react"

import "./index.css"

/*
- [ ] simple Dark and light themes with css variables
- [ ] vbox and hbox with child prop propagation
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
    return <div className={"hbox " + props.className} {...props}>{props.children}</div>
}

export function VBox(props: { children: ReactNode, className?:string }) {
    return <div className={"vbox " + props.className} {...props}>{props.children}</div>
}
