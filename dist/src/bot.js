import { z } from 'zod';
import crypto from 'crypto';
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
        const hmac = crypto.createHmac('sha256', signSecret);
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
export const tools = [{
        name: 'dingtalk_bot_send_message',
        description: 'send a message to a dingtalk chat via bot name',
        parameters: z.object({
            name: z.string().describe('bot name for send message to'),
            message: z.object({
                type: z
                    .enum(['text', 'link', 'markdown', 'actionCard', 'feedCard'])
                    .describe('message type to send'),
                content: z.string().optional(),
                text: z.string().optional(),
                title: z.string().optional(),
                picUrl: z.string().optional(),
                messageUrl: z.string().optional(),
                btnOrientation: z.enum(['0', '1']).optional(),
                singleTitle: z.string().optional(),
                singleURL: z.string().optional(),
                btns: z
                    .array(z.object({
                    title: z.string(),
                    actionURL: z.string(),
                }))
                    .optional(),
                links: z
                    .array(z.object({
                    title: z.string(),
                    messageURL: z.string(),
                    picURL: z.string(),
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
            notify: z.object({
                atMobiles: z
                    .array(z.string())
                    .optional()
                    .describe('mobile numbers to notify'),
                atUserIds: z
                    .array(z.string())
                    .optional()
                    .describe('user IDs to notify'),
                isAtAll: z.boolean().optional().describe('whether to notify all users'),
            }),
        }),
        execute: sendMessage,
    }];
