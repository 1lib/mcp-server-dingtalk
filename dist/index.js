#!/usr/bin/env node
"use strict";
const fastmcp = require("fastmcp");
const zod = require("zod");
const crypto = require("crypto");
const name = "mcp-server-dingtalk";
const version = "1.0.1";
const description = "A Model Context Protocol (MCP) server for DingTalk integration.";
const type = "commonjs";
const main = "dist/index.js";
const module$1 = "dist/index.js";
const types = "dist/index.d.ts";
const files = ["dist"];
const bin = { "mcp-server-dingtalk": "dist/index.js" };
const repository = { "type": "git", "url": "https://github.com/1lib/mcp-server-dingtalk.git" };
const scripts = { "build": "vite build && chmod +x dist/*", "dev": "vite build --watch", "start": "node dist/index.js", "test": 'echo "Error: no test specified" && exit 1' };
const keywords = [];
const author = "kingcc";
const license = "MIT";
const dependencies = { "fastmcp": "^2.1.3", "zod": "^3.25.31" };
const devDependencies = { "@types/node": "^22.15.23", "typescript": "5.8.3", "vite": "6.3.5" };
const packageInfo = {
  name,
  version,
  description,
  type,
  main,
  module: module$1,
  types,
  files,
  bin,
  repository,
  scripts,
  keywords,
  author,
  license,
  dependencies,
  devDependencies
};
function getUrl(name2) {
  const url = process.env.DINGTALK_BASE_URL ?? "https://oapi.dingtalk.com/robot/send";
  const botConfigs = JSON.parse(process.env.DINGTALK_BOT_CONFIGS ?? "[]");
  const config = botConfigs.find((config2) => config2.name === name2);
  if (!config) {
    throw new Error(`Cannot find dingtalk bot config via name=${name2}}`);
  }
  const { accessToken, signSecret } = config;
  if (signSecret) {
    const timestamp = Date.now();
    const stringToSign = `${timestamp}
${signSecret}`;
    const hmac = crypto.createHmac("sha256", signSecret);
    const sign = encodeURIComponent(hmac.update(stringToSign).digest("base64"));
    return `${url}?access_token=${accessToken}&timestamp=${timestamp}&sign=${sign}`;
  }
  return `${url}?access_token=${accessToken}`;
}
async function sendMessage({ name: name2, message, notify }) {
  const url = getUrl(name2);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      msgtype: message.type,
      [message.type]: message,
      at: notify
    })
  });
  const result = await response.json();
  return {
    content: [{ type: "text", text: `send message to dingtalk bot [name=${name2}] with result=${JSON.stringify(result)}` }]
  };
}
function appendTools(server2) {
  server2.addTool({
    name: "dingtalk_bot_send_message",
    description: "send a message to a dingtalk chat via bot name",
    parameters: zod.z.object({
      name: zod.z.string().describe("bot name for send message to"),
      message: zod.z.object({
        type: zod.z.enum(["text", "link", "markdown", "actionCard", "feedCard"]).describe("message type to send"),
        content: zod.z.string().optional(),
        text: zod.z.string().optional(),
        title: zod.z.string().optional(),
        picUrl: zod.z.string().optional(),
        messageUrl: zod.z.string().optional(),
        btnOrientation: zod.z.enum(["0", "1"]).optional(),
        singleTitle: zod.z.string().optional(),
        singleURL: zod.z.string().optional(),
        btns: zod.z.array(
          zod.z.object({
            title: zod.z.string(),
            actionURL: zod.z.string()
          })
        ).optional(),
        links: zod.z.array(
          zod.z.object({
            title: zod.z.string(),
            messageURL: zod.z.string(),
            picURL: zod.z.string()
          })
        ).optional()
      }).describe(`message to send.
type Message = TextMessage | LinkMessage | MarkdownMessage | ActionCardMessage | FeedCardMessage;
interface TextMessage {
  type: 'text';
  content: string;
}
interface LinkMessage {
  type: 'link';
  text: string;
  title: string;
  picUrl?: string;
  messageUrl: string;
}
interface MarkdownMessage {
  type: 'markdown';
  title?: string;
  text: string;
}
interface ActionCardMessage {
  type: 'actionCard';
  title: string;
  text: string; // markdown text  
  btnOrientation?: '0' | '1'; // 0: vertical, 1: horizontal
  singleTitle?: string; // single button title
  singleURL?: string; // single button URL
  btns?: Array<{
    title: string; // button title
    actionURL: string; // button URL
  }>; // array of buttons
}
interface FeedCardMessage {
  type: 'feedCard';
  links: Array<{
    title: string; // title of the link
    messageURL: string; // URL to open when the link is clicked on
    picURL: string; // image URL for the link
  }>; // array of links
}
        `),
      notify: zod.z.object({
        atMobiles: zod.z.array(zod.z.string()).optional().describe("mobile numbers to notify"),
        atUserIds: zod.z.array(zod.z.string()).optional().describe("user IDs to notify"),
        isAtAll: zod.z.boolean().optional().describe("whether to notify all users")
      })
    }),
    execute: sendMessage
  });
}
const server = new fastmcp.FastMCP(packageInfo);
appendTools(server);
server.start({
  transportType: "stdio"
});
