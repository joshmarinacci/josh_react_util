import React, {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";

import "./dialog.css"
import {toClass} from "./util";

type ShowDialogType = (view: ReactNode | null, visible: boolean) => void

interface DialogContextInterface {
    show(view: ReactNode): void

    hide(): void

    on_change(cb: ShowDialogType): void
}

export class DialogContextImpl implements DialogContextInterface {
    private listeners: ShowDialogType[];

    constructor() {
        this.listeners = []
    }

    hide(): void {
        this.listeners.forEach(cb => cb(null, false))
    }

    on_change(cb: ShowDialogType): void {
        this.listeners.push(cb)
    }

    show(view: ReactNode): void {
        this.listeners.forEach(cb => cb(view, true))
    }

}

export const sampleDialogContext: DialogContextInterface = new DialogContextImpl()
export const DialogContext = createContext<DialogContextInterface>(sampleDialogContext);

export function DialogContainer() {
    const wrapper = useRef<HTMLDivElement>(null);
    let dm = useContext(DialogContext)
    // @ts-ignore
    let [content, setContent] = useState<ReactNode | null>(null)
    const [prevFocus, setPrevFocus] = useState<Element | null>(null)
    const restoreFocus = () => {
        if (prevFocus instanceof HTMLElement) prevFocus.focus()
    }
    useEffect(() => {
        dm.on_change(v => {
            console.log("setting the content to ",v)
            if (v !== null) {
                setPrevFocus(document.activeElement)
                setTimeout(() => {
                    if (wrapper.current) {
                        const res1 = wrapper.current.querySelector('.focusable')
                        if (res1 instanceof HTMLElement) return res1.focus()
                        const res2 = wrapper.current.querySelector('button, input, textarea')
                        if (res2 instanceof HTMLElement) return res2.focus()
                    }
                }, 0)
            } else {
                console.log("hiding the dialog")
                restoreFocus()
            }
            setContent(v)
        })
    })
    return <div className={toClass({
        dialogWrapper: true,
        visible: content !== null,
    })} ref={wrapper}>
        {content ? content : ""}
    </div>
}
