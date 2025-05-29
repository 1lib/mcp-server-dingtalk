import packageInfo from "../package.json"
import { FastMCP as MCPServer } from "fastmcp"

import { appendTools as appendBotTools } from "./bot"

const server = new MCPServer(packageInfo as any)

appendBotTools(server)

server.start({
  transportType: "stdio",
})
