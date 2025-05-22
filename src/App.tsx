import {TabbedPanel} from "./tabbedpanel";
import {HBox, VBox} from "./comps";
import {PopupContainer, PopupContext, PopupContextImpl} from "./popup";
import {useContext, useRef, useState} from "react";
import "./index.css"
import {DialogContainer, DialogContext, DialogContextImpl} from "./dialog";
import {DragListDemo} from "./draglist";
import {toClass} from "./util";

function PopupContent() {
    const pm = useContext(PopupContext);
    const close = () => {
        pm.hide()
    }
    const [text, setText] = useState("some text");
    return <div className="show-focus-within vbox popup-background" onClick={(e) => e.stopPropagation()}>
        <h3>Popup Content</h3>
        <button>button</button>
        <select>
            <option>first item</option>
            <option>second item</option>
        </select>
        <button onClick={close}>close</button>
        <input type={'text'} value={text} onChange={(e) => setText(e.target.value)}/>
    </div>
}

const completions = [
    "smile",
    "happy",
    "explode",
]
const emojis = {
    "smile": "😀",
    "happy": "😃",
    "explode": "💥",
}

interface TextPopupProps {
    value: string,
    selected: string,
    elements: string[]
}

function TextPopup({value, selected, elements}: TextPopupProps) {
    return <ul style={{
        display: "flex",
        flexDirection: "column",
        border: '1px solid red',
    }}>
        {elements.map((item, index) => {
            return <li key={index} className={toClass({
                selected: selected === item
            })}>{item} {emojis[item]}</li>
        })}
    </ul>
}

function CustomInput() {
    const [text, setText] = useState("");
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState("smile");

    const inputRef = useRef<HTMLInputElement>(null)

    let value = ""
    if(inputRef.current) {
        console.log("selection is", inputRef.current.selectionStart, inputRef.current.selectionEnd)
        let n = text.lastIndexOf(":")
        if (n >= 0) {
            value = text.substring(n + 1)
        }
    }
    console.log("value is ", value)

    let elements = completions.filter(t => {
        if (!value) return true
        if (value.trim() === "") return true
        // console.log("checking ", t, value.trim())
        if (t.startsWith(value.trim())) return true
        return false
    })

    const moveSelectionDown = () => {
        let n = elements.indexOf(selected) + 1
        if (n >= elements.length) n = 0
        setSelected(elements[n])
    }
    const moveSelectionUp = () => {
        let n = elements.indexOf(selected) - 1
        if (n < 0) n = elements.length - 1
        setSelected(elements[n])
    }


    return <div><input type='text' value={text} ref={inputRef}
                       onKeyDown={(e) => {
                           // console.log("pressed ", e.key)
                           if (e.key === ':') {
                               setShow(true);
                           }
                           if (e.key === 'ArrowDown') {
                               e.preventDefault()
                               moveSelectionDown()
                           }
                           if (e.key === 'ArrowUp') {
                               e.preventDefault()
                               moveSelectionUp()
                           }
                           if (e.key === 'Enter') {
                               setShow(false);
                               let n = text.lastIndexOf(":")
                               if (n >= 0) {
                                   let before = text.substring(0, n)
                                   setText(before + emojis[selected])
                               }
                           }
                           if (e.key === 'Escape') {
                               e.preventDefault()
                               setShow(false);
                           }
                           if (e.key === 'Tab') {
                               e.preventDefault()
                           }
                       }}
                       onChange={(e) => {
                           setText(e.target.value)
                       }}/>
        {show && <TextPopup value={value} selected={selected} elements={elements}/>}
    </div>
}

function PopupDemo() {
    const pm = useContext(PopupContext);
    return <VBox>
        <CustomInput/>
        <HBox>
            <button>hbox</button>
            <button>hbox</button>
            <button>hbox</button>
            <button>hbox</button>
        </HBox>
        <VBox>
            <button>vbox</button>
            <button>vbox</button>
            <button>vbox</button>
            <button>vbox</button>
        </VBox>
        <HBox>
            <button
                onClick={(e) => pm.show_at(<PopupContent/>, e.target)}
            >show popup
            </button>
        </HBox>
    </VBox>
}


function TestDialog() {
    const dm = useContext(DialogContext);
    const [text, setText] = useState("some text");
    return <dialog>
        <header>Test Dialog</header>
        <section>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)}
                   onKeyDown={e => {
                       if (e.key === "Enter") {
                           e.preventDefault();
                           e.stopPropagation();
                           dm.hide()
                       }
                   }}
            />
        </section>
        <footer>
            <button className={'primary'} onClick={() => dm.hide()}>dismiss</button>
        </footer>
    </dialog>
}

function DialogDemo() {
    const dm = useContext(DialogContext);
    return <div className="show-focus-within">
        <button onClick={() => dm.show(<TestDialog/>)}>show dialog</button>
    </div>
}

export function App() {
    return <div className="debug">
        <DialogContext.Provider value={new DialogContextImpl()}>
            <PopupContext.Provider value={new PopupContextImpl()}>
                {/*<TabbedPanel titles={['Inputs', 'Layout', 'Dialog', 'Drag List']}>*/}
                {/*    <VBox className={'show-focus-within'}>*/}
                {/*        <PopupDemo/>*/}
                {/*    </VBox>*/}
                {/*    <VBox>*/}
                {/*        <button>tab 2</button>*/}
                {/*    </VBox>*/}
                {/*    <VBox>*/}
                {/*        <DialogDemo/>*/}
                {/*    </VBox>*/}
                {/*    <VBox>*/}
                        <DragListDemo/>
                {/*    </VBox>*/}
                {/*</TabbedPanel>*/}
                <DialogContainer/>
                <PopupContainer/>
            </PopupContext.Provider>
        </DialogContext.Provider>
    </div>
}