import React, { ReactNode } from "react";
import "./index.css";
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
export {};
