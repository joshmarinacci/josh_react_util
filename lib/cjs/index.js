"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopupContainer = exports.PopupContext = exports.PopupContextImpl = exports.DialogContainer = exports.DialogContext = exports.sampleDialogContext = exports.DialogContextImpl = exports.TabbedPanel = exports.FillPage = exports.VBox = exports.HBox = exports.toClass = exports.Spacer = void 0;
var react_1 = __importStar(require("react"));
require("./index.css");
var josh_js_util_1 = require("josh_js_util");
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
function Spacer() {
    return react_1.default.createElement("span", { className: "spacer" });
}
exports.Spacer = Spacer;
function toClass(param) {
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
exports.toClass = toClass;
function HBox(props) {
    var _a;
    var cls = toClass((_a = {
            hbox: true
        },
        _a[props.className] = (!!props.className),
        _a));
    return react_1.default.createElement("div", __assign({ className: cls }, props), props.children);
}
exports.HBox = HBox;
function VBox(props) {
    var _a;
    var cls = toClass((_a = {
            vbox: true
        },
        _a[props.className] = (!!props.className),
        _a));
    return react_1.default.createElement("div", __assign({ className: cls }, props), props.children);
}
exports.VBox = VBox;
function FillPage(props) {
    var _a;
    var cls = toClass((_a = {
            'fill-page': true
        },
        _a[props.className] = (!!props.className),
        _a));
    return react_1.default.createElement("div", { className: cls }, props.children);
}
exports.FillPage = FillPage;
function TabbedPanel(props) {
    var _a = (0, react_1.useState)(function () { return props.titles[0]; }), selected = _a[0], set_selected = _a[1];
    var child = null;
    if (Array.isArray(props.children)) {
        child = props.children[props.titles.indexOf(selected)];
    }
    return react_1.default.createElement("div", { className: "tabbed-pane" },
        react_1.default.createElement("div", { className: "tab-titles" }, props.titles.map(function (title) { return react_1.default.createElement("button", { className: toClass({ "tab-title": true, selected: selected === title }), key: title, onClick: function () { return set_selected(title); } }, title); })),
        react_1.default.createElement("div", { className: "tab-content" }, child ? child : "empty"));
}
exports.TabbedPanel = TabbedPanel;
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
exports.DialogContextImpl = DialogContextImpl;
exports.sampleDialogContext = new DialogContextImpl();
exports.DialogContext = (0, react_1.createContext)(exports.sampleDialogContext);
function DialogContainer() {
    var dm = (0, react_1.useContext)(exports.DialogContext);
    // @ts-ignore
    var _a = (0, react_1.useState)(null), content = _a[0], set_content = _a[1];
    (0, react_1.useEffect)(function () {
        dm.on_change(function (v) {
            set_content(v);
        });
    });
    return react_1.default.createElement("div", { className: toClass({
            dialogWrapper: true,
            visible: content !== null,
        }) }, content ? content : "no content");
}
exports.DialogContainer = DialogContainer;
var PopupContextImpl = /** @class */ (function () {
    function PopupContextImpl() {
        this.listeners = [];
    }
    PopupContextImpl.prototype.hide = function () {
        var evt = {
            type: "popup-event",
            direction: "below",
            owner: null,
            offset: new josh_js_util_1.Point(0, 0),
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
            offset: offset || new josh_js_util_1.Point(0, 0),
            content: view,
            visible: true,
        };
        this.listeners.forEach(function (cb) { return cb(evt); });
    };
    return PopupContextImpl;
}());
exports.PopupContextImpl = PopupContextImpl;
var samplePopupContext = new PopupContextImpl();
exports.PopupContext = (0, react_1.createContext)(samplePopupContext);
function PopupContainer() {
    var pm = (0, react_1.useContext)(exports.PopupContext);
    var _a = (0, react_1.useState)(null), event = _a[0], set_event = _a[1];
    var _b = (0, react_1.useState)(false), visible = _b[0], set_visible = _b[1];
    (0, react_1.useEffect)(function () {
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
    var content = react_1.default.createElement("div", null, "\"no content\"");
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
    return react_1.default.createElement("div", { className: toClass({
            popupScrim: true,
            visible: visible,
        }), onClick: clickedScrim },
        react_1.default.createElement("div", { className: "popupWrapper", style: style }, content));
}
exports.PopupContainer = PopupContainer;
