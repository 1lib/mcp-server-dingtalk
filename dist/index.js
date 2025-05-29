#!/usr/bin/env node
import packageInfo from "../package.json";
import { FastMCP as MCPServer } from "fastmcp";
import { tools } from "./bot.js";
const server = new MCPServer(packageInfo);
for (const tool of tools) {
    server.addTool(tool);
}
server.start({
    transportType: "stdio",
});
