import "./popup.css"
import {Point} from "josh_js_util";
import React, {createContext, ReactElement, ReactNode, useContext, useEffect, useState} from "react";
import {toClass} from "./util";

export type PopupDirection = "left" | "right" | "below" | "above" | "inside-top-left"
export type PopupEvent = {
    type:'popup-event',
    content:ReactElement,
    owner:any,
    offset:Point,
    direction: PopupDirection
    visible:boolean
}
export type ShowPopupType = (e:PopupEvent) => void
export interface PopupContextInterface {
    show_at(view: ReactElement, owner: any, direction?:PopupDirection, offset?:Point): void
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
            // @ts-ignore
            content:null,
        }
        this.listeners.forEach(cb => cb(evt))
    }

    on_change(cb:ShowPopupType): void {
        this.listeners.push(cb)
    }

    show_at(view: ReactElement, owner: any, direction?:PopupDirection, offset?:Point ): void {
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
        console.log("clicked on the scrim")
        set_visible(false)
    }
    let x = 0
    let y = 0
    let content = <div>"no content"</div>
    if(event && event.visible) {
        let rect = event.owner.getBoundingClientRect();
        x = rect.left;
        y = rect.top + rect.height;
        if(event.direction === "inside-top-left") {
            x = 0
            y = 0
        }
        if(event.direction === 'right') {
            x = rect.left + rect.width
        }
        content = event.content
        if(event.offset) {
            x += event.offset.x
            y += event.offset.y
        }
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

export function PopupBackground(props: { children: ReactNode }) {
    return <div className="popupBackground" {...props}
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                }}
    />;
}