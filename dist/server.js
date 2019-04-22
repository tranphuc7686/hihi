"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const port = 8080;
const host = "localhost";
app_1.default.listen(port, host, function () {
    console.log('Express server listening on port ' + port);
});
//# sourceMappingURL=server.js.map