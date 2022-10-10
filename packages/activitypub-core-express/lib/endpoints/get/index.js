"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleIndexGetRequest = void 0;
const handleIndexGetRequest = async (req, res) => {
    res.statusCode = 200;
    res.render('index.njk', {});
};
exports.handleIndexGetRequest = handleIndexGetRequest;
//# sourceMappingURL=index.js.map