"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tools = void 0;
const zod_1 = require("zod");
const crypto_1 = __importDefault(require("crypto"));
function getUrl(name) {
    const url = process.env.DINGTALK_BASE_URL ?? 'https://oapi.dingtalk.com/robot/send';
    const botConfigs = JSON.parse(process.env.DINGTALK_BOT_CONFIGS ?? '[]');
    const config = botConfigs.find((config) => config.name === name);
    if (!config) {
        throw new Error(`Cannot find dingtalk bot config via name=${name}}`);
    }
    const { accessToken, signSecret } = config;
    if (signSecret) {
        const timestamp = Date.now();
        const stringToSign = `${timestamp}\n${signSecret}`;
        const hmac = crypto_1.default.createHmac('sha256', signSecret);
        const sign = encodeURIComponent(hmac.update(stringToSign).digest('base64'));
        return `${url}?access_token=${accessToken}&timestamp=${timestamp}&sign=${sign}`;
    }
    return `${url}?access_token=${accessToken}`;
}
async function sendMessage({ name, message, notify }) {
    const url = getUrl(name);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            msgtype: message.type,
            [message.type]: message,
            at: notify,
        }),
    });
    const result = await response.json();
    return {
        content: [{ type: "text", text: `send message to dingtalk bot [name=${name}] with result=${JSON.stringify(result)}` }],
    };
}
exports.tools = [{
        name: 'dingtalk_bot_send_message',
        description: 'send a message to a dingtalk chat via bot name',
        parameters: zod_1.z.object({
            name: zod_1.z.string().describe('bot name for send message to'),
            message: zod_1.z.object({
                type: zod_1.z
                    .enum(['text', 'link', 'markdown', 'actionCard', 'feedCard'])
                    .describe('message type to send'),
                content: zod_1.z.string().optional(),
                text: zod_1.z.string().optional(),
                title: zod_1.z.string().optional(),
                picUrl: zod_1.z.string().optional(),
                messageUrl: zod_1.z.string().optional(),
                btnOrientation: zod_1.z.enum(['0', '1']).optional(),
                singleTitle: zod_1.z.string().optional(),
                singleURL: zod_1.z.string().optional(),
                btns: zod_1.z
                    .array(zod_1.z.object({
                    title: zod_1.z.string(),
                    actionURL: zod_1.z.string(),
                }))
                    .optional(),
                links: zod_1.z
                    .array(zod_1.z.object({
                    title: zod_1.z.string(),
                    messageURL: zod_1.z.string(),
                    picURL: zod_1.z.string(),
                }))
                    .optional(),
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
            notify: zod_1.z.object({
                atMobiles: zod_1.z
                    .array(zod_1.z.string())
                    .optional()
                    .describe('mobile numbers to notify'),
                atUserIds: zod_1.z
                    .array(zod_1.z.string())
                    .optional()
                    .describe('user IDs to notify'),
                isAtAll: zod_1.z.boolean().optional().describe('whether to notify all users'),
            }),
        }),
        execute: sendMessage,
    }];
