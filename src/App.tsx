import {TabbedPanel} from "./tabbedpanel";
import {HBox, VBox} from "./comps";
import {PopupContainer, PopupContext, PopupContextImpl} from "./popup";
import {useContext, useState} from "react";
import "./index.css"
import {DialogContainer, DialogContext, DialogContextImpl} from "./dialog";

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

function PopupDemo() {
    const pm = useContext(PopupContext);
    return <VBox>
        <input type={'text'}/>
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
            >show popup</button>
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
                       if(e.key === "Enter") {
                           e.preventDefault();
                           e.stopPropagation();
                           dm.hide()
                       }
                   }}
            />
        </section>
        <footer><button className={'primary'} onClick={() => dm.hide()}>dismiss</button></footer>
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
                <TabbedPanel titles={['Inputs', 'Layout', 'Dialog']}>
                    <VBox className={'show-focus-within'}>
                        <PopupDemo/>
                    </VBox>
                    <VBox>
                        <button>tab 2</button>
                    </VBox>
                    <VBox>
                        <DialogDemo/>
                    </VBox>
                </TabbedPanel>
                <DialogContainer/>
                <PopupContainer/>
            </PopupContext.Provider>
        </DialogContext.Provider>
    </div>
}