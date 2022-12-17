import { ReactNode } from "react";
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
    className?: string;
}): JSX.Element;
export declare function WrapBox(props: {
    children: ReactNode;
    className?: string;
}): JSX.Element;
export * from "./datagrid";
export * from "./dialog";
export * from "./popup";
export * from "./tabbedpanel";
