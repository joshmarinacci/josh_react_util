import {ReactNode} from 'react'
import {toClass} from "./util";
import "./comps.css"

export function Spacer() {
    return <span className={"spacer"}/>
}

export function HBox(props: { children: ReactNode, className?: string }) {
    const cls:Record<string,boolean> = {
        hbox: true,
    }
    if(props.className) cls[props.className] = true
    return <div className={toClass(cls)} {...props}>{props.children}</div>
}

export function VBox(props: { children: ReactNode, className?: string }) {
    const cls:Record<string,boolean> = {
        vbox: true,
    }
    if(props.className) cls[props.className] = true
    return <div className={toClass(cls)} {...props}>{props.children}</div>
}

export function FillPage(props: { children: ReactNode, className?: string }) {
    const cls:Record<string,boolean> = {
        'fill-page': true,
    }
    if(props.className) cls[props.className] = true
    return <div className={toClass(cls)} {...props}>{props.children}</div>
}

export function WrapBox(props: { children: ReactNode, className?: string }) {
    const cls:Record<string,boolean> = {
        wrapbox: true,
    }
    if(props.className) cls[props.className] = true
    return <div className={toClass(cls)} {...props}>{props.children}</div>
}