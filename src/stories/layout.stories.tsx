import React from 'react';

import { ComponentStory, ComponentMeta } from '@storybook/react';

import {HBox, Spacer} from '../index';

export default {
    title:"HBox",
    component: HBox,
} as ComponentMeta<typeof HBox>;

export const Standard: ComponentStory<typeof HBox> = () => {
    return <HBox>
        <button>button 1</button>
        <Spacer/>
        <button>button 2</button>
    </HBox>
}

export const WithStyles:ComponentStory<typeof HBox> = () => {
    return <HBox className={"toolbar"}>
        <label>hbox here</label>
    </HBox>
}

