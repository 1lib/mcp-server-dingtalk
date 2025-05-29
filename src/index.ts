#!/usr/bin/env node
import packageInfo from "../package.json" with { type: "json" }
import { FastMCP as MCPServer } from "fastmcp"

import { tools } from "./bot.js"

const server = new MCPServer(packageInfo as any)

for (const tool of tools) {
  server.addTool(tool as any)
}

server.start({
  transportType: "stdio",
})
