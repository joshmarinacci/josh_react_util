var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React from "react";
import "./index.css";
/*
- [ ] simple Dark and light themes with css variables
- [x] vbox and hbox with child prop propagation
- [ ] main fill panel to completely fill the browser
- [ ] popup and dialog
- [ ] properly scaled canvas with a drawing delegate
- [ ] simple auto scaling continuous chart
- [ ] Tab panel. N children and array of titles
- [ ] verify I can import it into another project

 */
export function Spacer() {
    return React.createElement("span", { className: "spacer" });
}
export function toClass(param) {
    return Object.entries(param)
        .filter(function (_a) {
        var v = _a[1];
        return v;
    })
        .map(function (_a) {
        var k = _a[0];
        return k;
    })
        .join(" ");
}
export function HBox(props) {
    var _a;
    var cls = toClass((_a = {
            hbox: true
        },
        _a[props.className] = (!!props.className),
        _a));
    return React.createElement("div", __assign({ className: cls }, props), props.children);
}
export function VBox(props) {
    var _a;
    var cls = toClass((_a = {
            vbox: true
        },
        _a[props.className] = (!!props.className),
        _a));
    return React.createElement("div", __assign({ className: cls }, props), props.children);
}
export function FillPage(props) {
    var _a;
    var cls = toClass((_a = {
            'fill-page': true
        },
        _a[props.className] = (!!props.className),
        _a));
    return React.createElement("div", { className: cls }, props.children);
}
export function WrapBox(props) {
    var _a;
    var cls = toClass((_a = {
            wrapbox: true
        },
        _a[props.className] = (!!props.className),
        _a));
    return React.createElement("div", __assign({ className: cls }, props), props.children);
}
