#!/usr/bin/env node
import packageInfo from "../package.json"
import { FastMCP as MCPServer } from "fastmcp"

import { tools } from "./bot"

const server = new MCPServer(packageInfo as any)

for (const tool of tools) {
  server.addTool(tool as any)
}

server.start({
  transportType: "stdio",
})
