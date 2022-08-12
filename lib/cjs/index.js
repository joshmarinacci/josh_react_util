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
exports.DialogContainer = exports.DialogContext = exports.sampleDialogContext = exports.DialogContextImpl = exports.VBox = exports.HBox = exports.toClass = exports.Spacer = void 0;
var react_1 = __importStar(require("react"));
require("./index.css");
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
    return react_1.default.createElement("div", __assign({ className: "hbox " + props.className }, props), props.children);
}
exports.HBox = HBox;
function VBox(props) {
    return react_1.default.createElement("div", __assign({ className: "vbox " + props.className }, props), props.children);
}
exports.VBox = VBox;
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
// @ts-ignore
function DialogContainer(props) {
    // let dm = useContext(DialogContext)
    // @ts-ignore
    var _a = (0, react_1.useState)(null), content = _a[0], set_content = _a[1];
    // useEffect(()=>{
    // dm.on_change(v => {
    // console.log("changing dialog")
    // set_content(v)
    // })
    // })
    return react_1.default.createElement("div", { className: toClass({
            dialogWrapper: true,
            visible: content !== null
        }) }, content);
}
exports.DialogContainer = DialogContainer;
