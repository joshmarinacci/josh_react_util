import React, {useContext, MouseEvent} from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import {HBox, Spacer, VBox} from '../index';
import {PopupContainer, PopupContext, PopupContextImpl, PopupDirection} from "../popup";

export default {
    title:"Popup",
    component: PopupContainer,
} as ComponentMeta<typeof PopupContainer>;


function PopupExample(props:{dir:PopupDirection}) {
    let ctx = useContext(PopupContext)
    const show_popup = (e:MouseEvent) => {
        ctx.show_at(<VBox><button>first</button><button>second</button></VBox>,e.target,props.dir)
    }
    return <HBox>
        <button onClick={show_popup}>click for popup</button>
    </HBox>
}

export const Right: ComponentStory<typeof PopupContainer> = () => {
    let ctx = new PopupContextImpl()
    return <PopupContext.Provider value={ctx}>
            <PopupExample dir={"right"}/>
            <PopupContainer/>
        </PopupContext.Provider>
}

export const InsideTopLeft: ComponentStory<typeof PopupContainer> = () => {
    let ctx = new PopupContextImpl()
    return <PopupContext.Provider value={ctx}>
        <PopupExample dir={"inside-top-left"}/>
        <PopupContainer/>
    </PopupContext.Provider>
}

