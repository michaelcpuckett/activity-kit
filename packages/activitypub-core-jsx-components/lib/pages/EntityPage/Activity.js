"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityEntity = void 0;
const react_1 = __importDefault(require("react"));
function ActivityEntity({ activity }) {
    const { actor, target } = activity;
    console.log({
        activity,
    });
    let object = null;
    if ('object' in activity) {
        object = activity.object;
    }
    if (!actor) {
        return react_1.default.createElement(react_1.default.Fragment, null, "Not found.");
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h1", null, activity.type)));
}
exports.ActivityEntity = ActivityEntity;
//# sourceMappingURL=Activity.js.map