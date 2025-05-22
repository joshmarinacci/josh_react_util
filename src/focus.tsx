import {RefObject, useContext, useRef, useState, KeyboardEvent} from "react";
import {PopupContext} from "./popup";
import {HBox, VBox} from "./comps";
import {toClass} from "./util";


class FocusManager {
    private readonly refs: React.RefObject<HTMLElement>[];
    constructor(param: { refs: RefObject<HTMLElement>[] }) {
        this.refs = param.refs
        this.onKeyDown = this.onKeyDown.bind(this)
    }

    private setFocusedIndex(number: number) {
        if(number < 0) {
            number = this.refs.length - 1
        }
        if(number >= this.refs.length) {
            number = 0
        }
        this.refs[number].current?.focus()
    }


    // debugStatus() {
    //     console.log("ref count ", this.refs.length)
    //     for(let ref of this.refs) {
    //         if(ref.current) {
    //             if(ref.current === document.activeElement) {
    //                 // @ts-ignore
    //                 console.log("focused is", ref.current.value)
    //             }
    //         }
    //     }
    // }

    private findFocused() {
        for(let i = 0; i < this.refs.length; i++) {
            let ref = this.refs[i]
            if(ref.current == document.activeElement) {
                return {
                    input:ref.current,
                    index:i
                }
            }
        }
        return null;
    }

    moveSelectionDown() {
        const focused = this.findFocused()
        if(focused) this.setFocusedIndex(focused.index + 1)
    }
    moveSelectionUp() {
        const focused = this.findFocused()
        if(focused) this.setFocusedIndex(focused.index - 1)
    }

    onKeyDown(e:KeyboardEvent<HTMLElement>) {
        let target = e.target as HTMLElement
        if(e.key === 'ArrowDown') {
            if(target.nodeName === 'TEXTAREA') {
                const textarea = target as HTMLTextAreaElement
                if(textarea.selectionStart === textarea.value.length) {
                    this.moveSelectionDown()
                }
            } else {
                this.moveSelectionDown()
            }
        }
        if(e.key === 'ArrowUp') {
            if(target.nodeName === 'TEXTAREA') {
                const textarea = target as HTMLTextAreaElement
                if(textarea.selectionStart === 0) {
                    this.moveSelectionUp()
                }
            } else {
                this.moveSelectionUp()
            }
        }
    }
}

function FocusManagerExample() {
    const input1 = useRef<HTMLInputElement>(null)
    const input2 = useRef<HTMLInputElement>(null)
    const input3 = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [text,setText ] = useState("some text")
    const [fm] = useState(() => {
        return new FocusManager({
            refs: [input1, input2, input3, textareaRef]
        })
    })
    return <VBox>
        <input ref={input1} onKeyDown={fm.onKeyDown}/>
        <input ref={input2} onKeyDown={fm.onKeyDown}/>
        <input ref={input3} onKeyDown={fm.onKeyDown}/>
        <textarea rows={5} cols={20} ref={textareaRef}
                  onKeyDown={(e)=>{
                      fm.onKeyDown(e)
                      console.log("doing something special")
                  }}
                  value={text}
                  onChange={(e) => setText(e.target.value)} />
    </VBox>
}

export function PopupDemo() {
    const pm = useContext(PopupContext);
    return <HBox>
        <VBox>
            <h3>Custom Input</h3>
            <p>type : to pick emoji</p>
            <CustomInput/>
        </VBox>
        <VBox>
            <h3>Popup Focus Management</h3>
            <input type={'text'}/>
            <button
                onClick={(e) => pm.show_at(<PopupContent/>, e.target)}
            >show popup
            </button>
        </VBox>
        <VBox>
            <FocusManagerExample/>
        </VBox>
    </HBox>
}

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
const emojis:Record<string, string> = {
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
    if (inputRef.current) {
        // console.log("selection is", inputRef.current.selectionStart, inputRef.current.selectionEnd)
        let start = inputRef.current.selectionStart
        if(!start) start = inputRef.current.value.length
        let n = text.lastIndexOf(":", start)
        console.log("last index is",n,'start is',start)
        if (n >= 0) {
            value = text.substring(n + 1, start)
        }
    }

    const insertReplacement = () => {
        if(!inputRef.current) return;
        let start = inputRef.current.selectionStart
        if(!start) start = inputRef.current.value.length
        let n = text.lastIndexOf(":", start)
        if (n >= 0) {
            let before = text.substring(0, n)
            let after = text.substring(n + 1)
            setText(before + emojis[selected] + after)
        }
    }

    let elements = completions.filter(t => {
        if (!value) return true
        if (value.trim() === "") return true
        if (t.startsWith(value.trim())) return true
        return false
    })
    elements = elements.slice().sort()

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
                               if(show) {
                                   setShow(false)
                                   insertReplacement()
                               }
                           }
                           if (e.key === 'Escape') {
                               e.preventDefault()
                               setShow(false)
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