#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../package.json"));
const fastmcp_1 = require("fastmcp");
const bot_1 = require("./bot");
const server = new fastmcp_1.FastMCP(package_json_1.default);
for (const tool of bot_1.tools) {
    server.addTool(tool);
}
server.start({
    transportType: "stdio",
});
