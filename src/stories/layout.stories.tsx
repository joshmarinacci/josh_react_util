import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import {HBox, Spacer, VBox, WrapBox} from '../index';

export default {
    title:"layout",
    component: HBox,
} as ComponentMeta<typeof HBox>;

export const StandardHBox: ComponentStory<typeof HBox> = () => {
    return <HBox>
        <button>button 1</button>
        <button>button 2</button>
        <button>button 3</button>
        <label>a spacer to the right</label>
        <Spacer/>
        <label>a spacer to the left</label>
        <button>button 4</button>
    </HBox>
}
export const StandardVBox: ComponentStory<typeof HBox> = () => {
    return <VBox>
        <button>button 1</button>
        <button>button 2</button>
        <button>button 3</button>
        <label>a spacer to the right</label>
        <Spacer/>
        <label>a spacer to the left</label>
        <button>button 4</button>
    </VBox>
}
const Card = () => {
    return <div style={{
        width:'300px',
        height:'300px',
        border:'1px solid red',
    }}>card</div>
}
export const StandardWrapBox: ComponentStory<typeof HBox> = () => {
    return <WrapBox>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
        <Card/>
    </WrapBox>
}

export const WithStyles:ComponentStory<typeof HBox> = () => {
    return <HBox className={"toolbar"}>
        <label>hbox here</label>
    </HBox>
}

