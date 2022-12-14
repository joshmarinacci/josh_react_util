import {HBox, Spacer, VBox} from "../index";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import React from "react";
import {TabbedPanel} from "../tabbedpanel";

export default {
    component: TabbedPanel,
} as ComponentMeta<typeof TabbedPanel>;

export const Standard: ComponentStory<typeof HBox> = () => {
    return <TabbedPanel titles={['first','second',"third"]}>
        <VBox>
        <button>panel 1</button>
        </VBox>
        <VBox>
        <button>panel 2</button>
        </VBox>
        <HBox>
            <label>panel 3</label>
        </HBox>
    </TabbedPanel>
}
