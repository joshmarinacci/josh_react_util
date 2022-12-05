import React, {createContext, ReactNode, useContext, useEffect, useState} from "react"

import "./index.css"
import {Point} from "josh_js_util";

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







export type PopupDirection = "left" | "right" | "below" | "above"
export type PopupEvent = {
    type:'popup-event',
    content:JSX.Element,
    owner:any,
    offset:Point,
    direction: PopupDirection
    visible:boolean
}
export type ShowPopupType = (e:PopupEvent) => void
export interface PopupContextInterface {
    show_at(view: JSX.Element, owner: any, direction?:PopupDirection, offset?:Point ): void
    hide():void
    on_change(cb:ShowPopupType): void
}

export class PopupContextImpl implements PopupContextInterface {
    private listeners: ShowPopupType[];
    constructor() {
        this.listeners = []
    }
    hide(): void {
        let evt:PopupEvent = {
            type:"popup-event",
            direction:"below",
            owner:null,
            offset: new Point(0,0),
            visible:false,
            content:null,
        }
        this.listeners.forEach(cb => cb(evt))
    }

    on_change(cb:ShowPopupType): void {
        this.listeners.push(cb)
    }

    show_at(view: JSX.Element, owner: any, direction?:PopupDirection, offset?:Point, ): void {
        let evt:PopupEvent = {
            type:"popup-event",
            direction:direction || "right",
            owner:owner,
            offset: offset || new Point(0,0),
            content:view,
            visible:true,
        }
        this.listeners.forEach(cb => cb(evt))
    }

}
const samplePopupContext: PopupContextInterface = new PopupContextImpl()
export const PopupContext = createContext<PopupContextInterface>(samplePopupContext);


export function PopupContainer() {
    let pm = useContext(PopupContext)
    let [event, set_event] = useState<PopupEvent | null>(null)
    let [visible, set_visible] = useState(false)
    useEffect(()=>{
        pm.on_change((e) => {
            set_event(e)
            set_visible(e.visible)
        })
    })
    const clickedScrim = () => {
        set_visible(false)
    }
    let x = 0
    let y = 0
    let content = <div>"no content"</div>
    if(event && event.visible) {
        let rect = event.owner.getBoundingClientRect();
        x = rect.left;
        if(event.direction === 'right') {
            x = rect.left + rect.width
        }
        y = rect.top + rect.height;
        content = event.content
    }
    const style = {
        left: `${x}px`,
        top: `${y}px`,
    }
    return <div className={toClass({
        popupScrim:true,
        visible:visible,
    })} onClick={clickedScrim}>
        <div className={"popupWrapper"} style={style}>{content}</div>
    </div>
}
