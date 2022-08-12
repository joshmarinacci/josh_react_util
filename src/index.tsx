import React, {createContext, ReactNode, useContext, useEffect, useState} from "react"

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
    return <div className={"hbox " + props.className?props.className:""} {...props}>{props.children}</div>
}

export function VBox(props: { children: ReactNode, className?:string }) {
    return <div className={"vbox " + props.className?props.className:""} {...props}>{props.children}</div>
}


type ShowDialogType = (view:JSX.Element|null, visible:boolean) => void
interface DialogContextInterface {
    show(view: JSX.Element): void
    hide():void
    on_change(cb:ShowDialogType): void
}
export class DialogContextImpl implements DialogContextInterface {
    private listeners: ShowDialogType[];
    constructor() {
        this.listeners = []
    }
    hide(): void {
        this.listeners.forEach(cb => cb(null,false))
    }

    on_change(cb:ShowDialogType): void {
        this.listeners.push(cb)
    }

    show(view: JSX.Element): void {
        this.listeners.forEach(cb => cb(view,true))
    }

}
export const sampleDialogContext: DialogContextInterface = new DialogContextImpl()
export const DialogContext = createContext<DialogContextInterface>(sampleDialogContext);

export function DialogContainer() {
     let dm = useContext(DialogContext)
    // @ts-ignore
    let [content, set_content] = useState<JSX.Element|null>(null)
    useEffect(()=>{
        dm.on_change(v => {
            console.log("changing dialog")
            set_content(v)
        })
    })
    return <div className={toClass({
        dialogWrapper:true,
        visible:true,
    })}>
        <span>dialog is here</span>
        {content?content:"no content"}
    </div>
}