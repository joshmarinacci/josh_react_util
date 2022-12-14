import {
    HBox,
    Spacer,
} from "../index";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React, {useContext} from "react";
import {DialogContainer, DialogContextImpl, DialogContext} from "../dialog";

export default {
    component: DialogContainer,
} as ComponentMeta<typeof DialogContainer>;

function SimpleDialog() {
    let ctx = useContext(DialogContext)

    const dismiss = () => ctx.hide()
    return <div className={'dialog'}>
        <header>header</header>
        <section>a dialog is here</section>
        <footer>
            <button onClick={dismiss}>cancel</button>
            <Spacer/>
            <button onClick={dismiss}>okay</button>
        </footer>
    </div>
}

export const Standard: ComponentStory<typeof HBox> = () => {
    let ctx = new DialogContextImpl()
    return <div>
        <DialogContext.Provider value={ctx}>
            <HBox>
                <button onClick={()=>{ctx.show(<SimpleDialog/>)}}>click for dialog</button>
            </HBox>
            <DialogContainer/>
        </DialogContext.Provider>
    </div>
}
