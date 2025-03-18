import {TabbedPanel} from "./tabbedpanel";
import {HBox, VBox} from "./comps";
import {PopupBackground, PopupContainer, PopupContext, PopupContextImpl} from "./popup";
import {useContext} from "react";
import "./index.css"

function PopupContent() {
    return <PopupBackground>
        <h3>Popup Content</h3>
        <button>button</button>
        <select>
            <option>first item</option>
            <option>second item</option>
        </select>
    </PopupBackground>
}

function PopupDemo() {
    const pm = useContext(PopupContext);
    return <VBox>
        <HBox>
            <button onClick={(e) => {
                pm.show_at(<PopupContent/>, e.target)
            }}>show popup
            </button>
        </HBox>
    </VBox>
}

export function App() {
    return <PopupContext.Provider value={new PopupContextImpl()}>
        <TabbedPanel titles={['tab1', 'tab2']}>
            <VBox>
                <PopupDemo/>
            </VBox>
            <VBox>
                <button>tab 2</button>
            </VBox>
        </TabbedPanel>
        <PopupContainer/>
    </PopupContext.Provider>

}