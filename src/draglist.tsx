import "./draglist.css"
import {MouseEvent, useRef} from "react"
const log = (...args:any[]) => console.log("",...args);


let dragTarget:HTMLElement|null
let clientY:number
let timer:number|null

function checkBounds(dragTarget:HTMLElement, list:HTMLElement) {
    const list_bounds = list.getBoundingClientRect()
    const dragtarget_bounds = dragTarget.getBoundingClientRect()
    const target_y = dragtarget_bounds.top - list_bounds.top
    if(target_y < 0) {
        list.scrollTop = Math.max(list.scrollTop - 5,0);
    }
    if(target_y + dragtarget_bounds.height > list.clientHeight) {
        list.scrollTop = Math.min(list.scrollTop + 5, list.clientHeight);
    }
    dragTarget.style.top = (clientY - list_bounds.top + list.scrollTop - 10) + "px";
}

function startDrag(ul:HTMLElement, li:HTMLElement, cy:number) {
    log('start drag')
    dragTarget = li;
    dragTarget.classList.add('dragging')
    clientY = cy
    timer = setInterval(() => {
        checkBounds(dragTarget as HTMLElement, ul)
    },10)
}

function moveDrag(ul:HTMLElement, cy:number) {
    if(!dragTarget) return;
    log('move drag')
    const list = ul
    const list_bounds = list.getBoundingClientRect()
    clientY = cy
    for(let i = 0; i < ul.children.length; i++) {
        const li = ul.children[i] as HTMLElement
        if(li === dragTarget) {
            dragTarget.style.left = '0px'
            dragTarget.style.top = (cy - list_bounds.top + list.scrollTop - 10) + "px";
        } else {
            const bounds = li.getBoundingClientRect()
            const half = bounds.height / 2
            if (bounds.bottom - half < clientY) {
                li.style.transform = 'translateY(0)'
            }
            if (bounds.top + half > clientY) {
                li.style.transform = 'translateY(100%)'
            }
        }
    }
}

function stopDrag(ul:HTMLElement) {
    // dragging = false
    log('stop drag')
    if (dragTarget) {
        if (timer) clearInterval(timer)
        timer = null
        dragTarget.classList.remove('dragging')
        dragTarget = null
        clientY = -1
        for(let i = 0; i < ul.children.length; i++) {
            const li = ul.children[i] as HTMLElement
            li.style.transform = 'translateY(0)'
        }
    }
}

function startMouseDrag(ul:HTMLElement, li:HTMLElement, clientY:number) {
    log('start mouse drag')
    startDrag(ul, li, clientY)
    const handle_mouse_move = (e) => {
        if(!dragTarget) return;
        log("mouse move")
        e.preventDefault()
        e.stopPropagation()
        moveDrag(ul, e.clientY)
    }
    const handle_mouse_end = (e) => {
        log("mouse end")
        stopDrag(ul)
        window.removeEventListener('mousemove',handle_mouse_move)
        window.removeEventListener('mouseup', handle_mouse_end)
    }
    window.addEventListener('mousemove', handle_mouse_move)
    window.addEventListener("mouseup", handle_mouse_end)
}

export function DragListDemo() {
    const ref = useRef<HTMLUListElement|null>(null)
    const onMouseDown = (e:MouseEvent<HTMLElement>) => {
        const span = e.target as HTMLElement
        const li = span.parentElement as HTMLElement
        const clientY = e.clientY
        startMouseDrag(ref.current as HTMLElement, li, clientY)
    }

    const props = {
        onMouseDown: onMouseDown,
    }

    return <ul ref={ref} style={{
        maxHeight: '150px',
        overflow: 'scroll',
    }}>
        <li>Drag Item one   <span {...props}>D</span></li>
        <li>Drag Item two   <span {...props}>D</span></li>
        <li>Drag Item three <span {...props}>D</span></li>
        <hr/>
        <li>Drag Item four  <span {...props}>D</span></li>
        <li>Drag Item five  <span {...props}>D</span></li>
        <li>Drag Item six   <span {...props}>D</span></li>
        <li>Drag Item seven <span {...props}>D</span></li>
        <li>Drag Item eight <span {...props}>D</span></li>
    </ul>
}


/*

    let dragTarget = null;
    let dragging = false;
    let timer = null;
    let clientY = -1
    let hold = null

    if(target_y + dragtarget_bounds.height > list.clientHeight) {
    list.scrollTop = Math.min(list.scrollTop + 5, list.clientHeight);
}
    dragTarget.style.top = (clientY - list_bounds.top + list.scrollTop - 10) + "px";
}

}
}
}

function startTouchDrag(li, clientY) {
    log('start touch drag')
    startDrag(li, clientY)
    const handle_touch_move = (e) => {
        if(!dragTarget) return;
        log('touch move')
        e.preventDefault()
        e.stopPropagation()
        moveDrag(e.touches[0].clientY)
    }
    const handle_touch_end = (e) => {
        stopDrag()
        log('touch end')
        window.removeEventListener("touchmove", handle_touch_move, { passive: false})
        window.removeEventListener("touchend", handle_touch_end)
    }
    window.addEventListener("touchmove", handle_touch_move, {  passive: false })
    window.addEventListener("touchend", handle_touch_end)
}

function startMouseDrag(li, clientY) {
    log('start mouse drag')
    startDrag(li, clientY)
    const handle_mouse_move = (e) => {
        if(!dragTarget) return;
        log("mouse move")
        e.preventDefault()
        e.stopPropagation()
        moveDrag(e.clientY)
    }
    const handle_mouse_end = (e) => {
        log("mouse end")
        stopDrag()
        window.removeEventListener('mousemove',handle_mouse_move)
        window.removeEventListener('mouseup', handle_mouse_end)
    }
    window.addEventListener('mousemove', handle_mouse_move)
    window.addEventListener("mouseup", handle_mouse_end)
}

 */