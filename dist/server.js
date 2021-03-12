"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var api_1 = require("./api");
api_1.app.listen(process.env.PORT);
