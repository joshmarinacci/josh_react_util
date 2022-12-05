import React, { ReactNode } from "react";
import "./index.css";
import { Point } from "josh_js_util";
export declare function Spacer(): JSX.Element;
export declare function toClass(param: object): string;
export declare function HBox(props: {
    children: ReactNode;
    className?: string;
}): JSX.Element;
export declare function VBox(props: {
    children: ReactNode;
    className?: string;
}): JSX.Element;
export declare function FillPage(props: {
    children: ReactNode;
    className?: string;
}): JSX.Element;
export declare function TabbedPanel(props: {
    titles: string[];
    children: ReactNode;
}): JSX.Element;
declare type ShowDialogType = (view: JSX.Element | null, visible: boolean) => void;
interface DialogContextInterface {
    show(view: JSX.Element): void;
    hide(): void;
    on_change(cb: ShowDialogType): void;
}
export declare class DialogContextImpl implements DialogContextInterface {
    private listeners;
    constructor();
    hide(): void;
    on_change(cb: ShowDialogType): void;
    show(view: JSX.Element): void;
}
export declare const sampleDialogContext: DialogContextInterface;
export declare const DialogContext: React.Context<DialogContextInterface>;
export declare function DialogContainer(): JSX.Element;
export declare type PopupDirection = "left" | "right" | "below" | "above";
export declare type PopupEvent = {
    type: 'popup-event';
    content: JSX.Element;
    owner: any;
    offset: Point;
    direction: PopupDirection;
    visible: boolean;
};
export declare type ShowPopupType = (e: PopupEvent) => void;
export interface PopupContextInterface {
    show_at(view: JSX.Element, owner: any, direction?: PopupDirection, offset?: Point): void;
    hide(): void;
    on_change(cb: ShowPopupType): void;
}
export declare class PopupContextImpl implements PopupContextInterface {
    private listeners;
    constructor();
    hide(): void;
    on_change(cb: ShowPopupType): void;
    show_at(view: JSX.Element, owner: any, direction?: PopupDirection, offset?: Point): void;
}
export declare const PopupContext: React.Context<PopupContextInterface>;
export declare function PopupContainer(): JSX.Element;
export {};
