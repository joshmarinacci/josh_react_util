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
import React, { createContext, useContext, useEffect, useState } from "react";
import "./index.css";
import { Point } from "josh_js_util";
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
export function TabbedPanel(props) {
    var _a = useState(function () { return props.titles[0]; }), selected = _a[0], set_selected = _a[1];
    var child = null;
    if (Array.isArray(props.children)) {
        child = props.children[props.titles.indexOf(selected)];
    }
    return React.createElement("div", { className: "tabbed-pane" },
        React.createElement("div", { className: "tab-titles" }, props.titles.map(function (title) { return React.createElement("button", { className: toClass({ "tab-title": true, selected: selected === title }), key: title, onClick: function () { return set_selected(title); } }, title); })),
        React.createElement("div", { className: "tab-content" }, child ? child : "empty"));
}
var DialogContextImpl = /** @class */ (function () {
    function DialogContextImpl() {
        this.listeners = [];
    }
    DialogContextImpl.prototype.hide = function () {
        this.listeners.forEach(function (cb) { return cb(null, false); });
    };
    DialogContextImpl.prototype.on_change = function (cb) {
        this.listeners.push(cb);
    };
    DialogContextImpl.prototype.show = function (view) {
        this.listeners.forEach(function (cb) { return cb(view, true); });
    };
    return DialogContextImpl;
}());
export { DialogContextImpl };
export var sampleDialogContext = new DialogContextImpl();
export var DialogContext = createContext(sampleDialogContext);
export function DialogContainer() {
    var dm = useContext(DialogContext);
    // @ts-ignore
    var _a = useState(null), content = _a[0], set_content = _a[1];
    useEffect(function () {
        dm.on_change(function (v) {
            set_content(v);
        });
    });
    return React.createElement("div", { className: toClass({
            dialogWrapper: true,
            visible: content !== null,
        }) }, content ? content : "no content");
}
var PopupContextImpl = /** @class */ (function () {
    function PopupContextImpl() {
        this.listeners = [];
    }
    PopupContextImpl.prototype.hide = function () {
        var evt = {
            type: "popup-event",
            direction: "below",
            owner: null,
            offset: new Point(0, 0),
            visible: false,
            content: null,
        };
        this.listeners.forEach(function (cb) { return cb(evt); });
    };
    PopupContextImpl.prototype.on_change = function (cb) {
        this.listeners.push(cb);
    };
    PopupContextImpl.prototype.show_at = function (view, owner, direction, offset) {
        var evt = {
            type: "popup-event",
            direction: direction || "right",
            owner: owner,
            offset: offset || new Point(0, 0),
            content: view,
            visible: true,
        };
        this.listeners.forEach(function (cb) { return cb(evt); });
    };
    return PopupContextImpl;
}());
export { PopupContextImpl };
var samplePopupContext = new PopupContextImpl();
export var PopupContext = createContext(samplePopupContext);
export function PopupContainer() {
    var pm = useContext(PopupContext);
    var _a = useState(null), event = _a[0], set_event = _a[1];
    var _b = useState(false), visible = _b[0], set_visible = _b[1];
    useEffect(function () {
        pm.on_change(function (e) {
            set_event(e);
            set_visible(e.visible);
        });
    });
    var clickedScrim = function () {
        set_visible(false);
    };
    var x = 0;
    var y = 0;
    var content = React.createElement("div", null, "\"no content\"");
    if (event && event.visible) {
        var rect = event.owner.getBoundingClientRect();
        x = rect.left;
        if (event.direction === 'right') {
            x = rect.left + rect.width;
        }
        y = rect.top + rect.height;
        content = event.content;
    }
    var style = {
        left: "".concat(x, "px"),
        top: "".concat(y, "px"),
    };
    return React.createElement("div", { className: toClass({
            popupScrim: true,
            visible: visible,
        }), onClick: clickedScrim },
        React.createElement("div", { className: "popupWrapper", style: style }, content));
}
