import "./draglist.css"
import {MouseEvent, TouchEvent, useRef, useState, MutableRefObject} from "react"
import {hasTouchScreen, toClass} from "./util";
const log = (...args:any[]) => console.log("",...args);

class DragState {
    private list: HTMLElement
    private dragTarget: HTMLElement
    private timer:number|undefined
    private clientY: number

    constructor(list:HTMLElement, dragTarget:HTMLElement) {
        this.list = list
        this.dragTarget = dragTarget
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
    moveDrag(cy:number) {
        if(!this.dragTarget) return;
        // log('move drag at ' + cy)
        const list_bounds = this.list.getBoundingClientRect()
        this.clientY = cy
        for(let i = 0; i < this.list.children.length; i++) {
            const item = this.list.children[i] as HTMLElement
            if(item === this.dragTarget) {
                item.style.left = '0px'
                item.style.top = (this.clientY - list_bounds.top + this.list.scrollTop - 10) + "px";
            } else {
                const bounds = item.getBoundingClientRect()
                const half = bounds.height / 2
                if (bounds.bottom - half < this.clientY) {
                    item.style.transform = 'translateY(0)'
                }
                if (bounds.top + half > this.clientY) {
                    item.style.transform = 'translateY(100%)'
                }
            }
        }
    }
    stopDrag() {
        // log('stop drag')
        if (this.dragTarget) {
            clearInterval(this.timer)
            this.dragTarget.classList.remove('dragging')
            for(let i = 0; i < this.list.children.length; i++) {
                const item = this.list.children[i] as HTMLElement
                item.style.transform = 'translateY(0)'
            }
            console.log("time to rearrange the elements")
        }
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
    startTouchDrag(clientY: number) {
        log('start touch drag')
        this.startDrag(clientY)
        const handle_touch_move = (e) => {
            if(!this.dragTarget) return;
            // log('touch move')
            e.preventDefault()
            e.stopPropagation()
            this.moveDrag(e.touches[0].clientY)
        }
        const handle_touch_end = (e) => {
            this.stopDrag()
            // log('touch end')
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

function useDragMaster(param: { list: MutableRefObject<HTMLUListElement | null> }) {
    const {list} = param
    const onMouseDown = (e:MouseEvent<HTMLElement>) => {
        const span = e.target as HTMLElement
        const li = span.parentElement as HTMLElement
        const clientY = e.clientY
        let ds = new DragState(list.current as HTMLElement, li)
        ds.startMouseDrag(clientY)
    }
    const onTouchStart = (e:TouchEvent<HTMLElement>) => {
        hold = setTimeout(() => {
            clearTimeout(hold)
            hold = undefined
            const li = e.target as HTMLElement
            let ds = new DragState(list.current as HTMLElement, li)
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
            console.log("tapped")
        }
    }
    const onContextMenu = (e:MouseEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }
    const isTouch = hasTouchScreen()
    return {
        touchHandlers: {
            onTouchStart,
            onTouchMove,
            onTouchEnd,
            onContextMenu,
        },
        mouseHandlers: {
            onMouseDown,
        },
        isTouch,
    }
}

export function DragListDemo() {
    const listRef = useRef<HTMLUListElement|null>(null)
    const [sel, setSel] = useState(data[0])
    const opts = useDragMaster({
        list:listRef
    })


    const moveSelectionUp = () => {
        console.log("nav up")
        let n = data.indexOf(sel) - 1
        if (n < 0) n = data.length - 1
        setSel(data[n])
    }
    const moveSelectionDown = () => {
        console.log("nav down")
        let n = data.indexOf(sel) + 1
        if (n >= data.length) n = 0
        setSel(data[n])
    }
    return <ul ref={listRef} style={{
        maxHeight: '150px',
        overflow: 'scroll',
    }}>
        {data.map(d => {
            return <li key={d}
                       tabIndex={0}
                       className={toClass({ selected: sel===d })}
                       onMouseDown={(e:MouseEvent<HTMLElement>) => setSel(d)}
                       onKeyDown={(e) => {
                           if(e.key === 'ArrowUp') {
                               e.preventDefault()
                               moveSelectionUp()
                           }
                           if(e.key === 'ArrowDown') {
                               e.preventDefault()
                               moveSelectionDown()
                           }
                       }}
                       {... opts.touchHandlers}
            >
                {d}
                {!opts.isTouch && <span onMouseDown={opts.mouseHandlers.onMouseDown}>D</span>}
            </li>
        })}
    </ul>
}