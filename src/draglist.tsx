import "./draglist.css"
import {MouseEvent, TouchEvent, useRef, useState} from "react"
import {hasTouchScreen, toClass} from "./util";
const log = (...args:any[]) => console.log("",...args);

class DragState {
    private list: HTMLElement
    private dragTarget: HTMLElement
    private timer:number|null
    private clientY: number

    constructor(list:HTMLElement, dragTarget:HTMLElement) {
        this.list = list
        this.dragTarget = dragTarget
        this.timer = null
        this.clientY = 0
    }

    checkBounds() {
        if(!this.dragTarget) return
        const list_bounds = this.list.getBoundingClientRect()
        const dragtarget_bounds = this.dragTarget.getBoundingClientRect()
        const target_y = dragtarget_bounds.top - list_bounds.top
        if(target_y < 0) {
            this.list.scrollTop = Math.max(this.list.scrollTop - 5,0);
        }
        if(target_y + dragtarget_bounds.height > this.list.clientHeight) {
            this.list.scrollTop = Math.min(this.list.scrollTop + 5, this.list.clientHeight);
        }
        this.dragTarget.style.top = (this.clientY - list_bounds.top + this.list.scrollTop - 10) + "px";
    }

    startDrag(cy:number) {
        log('start drag')
        this.dragTarget.classList.add('dragging')
        this.clientY = cy
        this.timer = setInterval(() => {
            this.checkBounds()
        },10)
    }
    startMouseDrag(clientY:number) {
        log('start mouse drag')
        this.startDrag(clientY)
        const handle_mouse_move = (e) => {
            if(!this.dragTarget) return;
            log("mouse move")
            e.preventDefault()
            e.stopPropagation()
            this.moveDrag(e.clientY)
        }
        const handle_mouse_end = (e) => {
            log("mouse end")
            this.stopDrag()
            window.removeEventListener('mousemove',handle_mouse_move)
            window.removeEventListener('mouseup', handle_mouse_end)
        }
        window.addEventListener('mousemove', handle_mouse_move)
        window.addEventListener("mouseup", handle_mouse_end)
    }
    moveDrag(cy:number) {
        if(!this.dragTarget) return;
        log('move drag at ' + cy)
        const list_bounds = this.list.getBoundingClientRect()
        this.clientY = cy
        for(let i = 0; i < this.list.children.length; i++) {
            const li = this.list.children[i] as HTMLElement
            if(li === this.dragTarget) {
                this.dragTarget.style.left = '0px'
                this.dragTarget.style.top = (cy - list_bounds.top + this.list.scrollTop - 10) + "px";
            } else {
                const bounds = li.getBoundingClientRect()
                const half = bounds.height / 2
                if (bounds.bottom - half < this.clientY) {
                    li.style.transform = 'translateY(0)'
                }
                if (bounds.top + half > this.clientY) {
                    li.style.transform = 'translateY(100%)'
                }
            }
        }
    }
    stopDrag() {
        log('stop drag')
        if (this.dragTarget) {
            if (this.timer) clearInterval(this.timer)
            this.timer = null
            this.dragTarget.classList.remove('dragging')
            this.dragTarget = null
            this.clientY = -1
            for(let i = 0; i < this.list.children.length; i++) {
                const li = this.list.children[i] as HTMLElement
                li.style.transform = 'translateY(0)'
            }
        }
    }

    startTouchDrag(clientY: number) {
        log('start touch drag')
        this.startDrag(clientY)
        const handle_touch_move = (e) => {
            if(!this.dragTarget) return;
            log('touch move')
            e.preventDefault()
            e.stopPropagation()
            this.moveDrag(e.touches[0].clientY)
        }
        const handle_touch_end = (e) => {
            this.stopDrag()
            log('touch end')
            window.removeEventListener("touchmove", handle_touch_move, { passive: false})
            window.removeEventListener("touchend", handle_touch_end)
        }
        window.addEventListener("touchmove", handle_touch_move, {  passive: false })
        window.addEventListener("touchend", handle_touch_end)
    }
}

const data = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h"
]

let hold: number | undefined

export function DragListDemo() {
    const listRef = useRef<HTMLUListElement|null>(null)
    const onMouseDown = (e:MouseEvent<HTMLElement>) => {
        const span = e.target as HTMLElement
        const li = span.parentElement as HTMLElement
        const clientY = e.clientY
        let ds = new DragState(listRef.current as HTMLElement, li)
        ds.startMouseDrag(clientY)
    }
    const [sel, setSel] = useState(data[0])

    const touch = hasTouchScreen()

    const onTouchStart = (e:TouchEvent<HTMLElement>) => {
        hold = setTimeout(() => {
            clearTimeout(hold)
            hold = undefined
            const li = e.target as HTMLElement
            let ds = new DragState(listRef.current as HTMLElement, li)
            ds.startTouchDrag(e.touches[0].clientY)
        },1000)
    }
    const onTouchMove = (e:TouchEvent<HTMLElement>) => {
        if(hold) {
            console.log("clearing hold")
            clearTimeout(hold)
            hold = undefined
        }
    }
    const onTouchEnd = (e:TouchEvent<HTMLElement>) => {
        if(hold) {
            console.log("clearing hold")
            clearTimeout(hold)
            hold = undefined
        }
    }

    return <ul ref={listRef} style={{
        maxHeight: '150px',
        overflow: 'scroll',
    }}>
        {data.map(d => {
            return <li key={d}
                       className={toClass({ selected: sel===d })}
                       onMouseDown={(e:MouseEvent<HTMLElement>) => setSel(d)}
                       onContextMenu={(e) => {
                           e.preventDefault()
                           e.stopPropagation()
                         }}
                       onTouchStart={onTouchStart}
                       onTouchMove={onTouchMove}
                       onTouchEnd={onTouchEnd}
            >
                {d}
                {!touch && <span onMouseDown={onMouseDown}>D</span>}
            </li>
        })}
    </ul>
}