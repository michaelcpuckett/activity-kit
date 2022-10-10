"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeGetHandler = exports.userPostHandler = void 0;
const index_1 = __importDefault(require("./endpoints/user/index"));
exports.userPostHandler = index_1.default;
const index_2 = require("./endpoints/home/index");
Object.defineProperty(exports, "homeGetHandler", { enumerable: true, get: function () { return index_2.getServerSideProps; } });
//# sourceMappingURL=index.js.map