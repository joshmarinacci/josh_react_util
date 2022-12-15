import {HBox} from "../index";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {Button} from "@storybook/react/demo";
import React from "react";

export default {
    title:"Button styles",
    component: HBox,
} as ComponentMeta<typeof HBox>;


export const plain: ComponentStory<typeof Button> = () => {
    return <HBox>
        <button>simple button</button>
    </HBox>
}
