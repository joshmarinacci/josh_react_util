import {TabbedPanel} from "./tabbedpanel";
import {VBox} from "./comps";
import {PopupContainer, PopupContext, PopupContextImpl} from "./popup";
import {useContext, useState} from "react";
import "./index.css"
import {DialogContainer, DialogContext, DialogContextImpl} from "./dialog";
import {DragListDemo} from "./draglist";
import {PopupDemo} from "./focus";


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
                <TabbedPanel titles={['Inputs', 'Layout', 'Dialog', 'Drag List']}>
                    <VBox className={'show-focus-within'}>
                        <PopupDemo/>
                    </VBox>
                    <VBox>
                        <button>tab 2</button>
                    </VBox>
                    <VBox>
                        <DialogDemo/>
                    </VBox>
                    <VBox>
                        <DragListDemo/>
                    </VBox>
                </TabbedPanel>
                <DialogContainer/>
                <PopupContainer/>
            </PopupContext.Provider>
        </DialogContext.Provider>
    </div>
}