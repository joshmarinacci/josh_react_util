import React, {createContext, useContext, useEffect, useState} from "react";

import "./dialog.css"
import {toClass} from "./util";
type ShowDialogType = (view:Element|null, visible:boolean) => void
interface DialogContextInterface {
    show(view: Element): void
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

    show(view: Element): void {
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
            set_content(v)
        })
    })
    return <div className={toClass({
        dialogWrapper:true,
        visible:content!==null,
    })}>
        {content?content:"no content"}
    </div>
}
