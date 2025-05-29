import { z } from 'zod';
import crypto from 'crypto';

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
type Message =
  | TextMessage
  | LinkMessage
  | MarkdownMessage
  | ActionCardMessage
  | FeedCardMessage;

// {
//   "at": {
//       "atMobiles":[
//           "180xxxxxx"
//       ],
//       "atUserIds":[
//           "user123"
//       ],
//       "isAtAll": false
//   },
//   "text": {
//       "content":"我就是我, @XXX 是不一样的烟火"
//   },
//   "msgtype":"text"
// }
//
// {
//   "msgtype": "link",
//   "link": {
//       "text": "这个即将发布的新版本，创始人xx称它为红树林。而在此之前，每当面临重大升级，产品经理们都会取一个应景的代号，这一次，为什么是红树林",
//       "title": "时代的火车向前开",
//       "picUrl": "",
//       "messageUrl": "https://www.dingtalk.com/s?__biz=MzA4NjMwMTA2Ng==&mid=2650316842&idx=1&sn=60da3ea2b29f1dcc43a7c8e4a7c97a16&scene=2&srcid=09189AnRJEdIiWVaKltFzNTw&from=timeline&isappinstalled=0&key=&ascene=2&uin=&devicetype=android-23&version=26031933&nettype=WIFI"
//   }
// }

// {
//   "msgtype": "markdown",
//   "markdown": {
//       "title":"杭州天气",
//       "text": "#### 杭州天气 @150XXXXXXXX \n > 9度，西北风1级，空气良89，相对温度73%\n > ![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png)\n > ###### 10点20分发布 [天气](https://www.dingtalk.com) \n"
//   },
//    "at": {
//        "atMobiles": [
//            "150XXXXXXXX"
//        ],
//        "atUserIds": [
//            "user123"
//        ],
//        "isAtAll": false
//    }
// }

// {
//   "actionCard": {
//       "title": "乔布斯 20 年前想打造一间苹果咖啡厅，而它正是 Apple Store 的前身",
//       "text": "![screenshot](https://gw.alicdn.com/tfs/TB1ut3xxbsrBKNjSZFpXXcXhFXa-846-786.png)
// ### 乔布斯 20 年前想打造的苹果咖啡厅
// Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划",
//       "btnOrientation": "0",
//       "singleTitle" : "阅读全文",
//       "singleURL" : "https://www.dingtalk.com/"
//   },
//   "msgtype": "actionCard"
// }

// {
//   "msgtype": "actionCard",
//   "actionCard": {
//       "title": "我 20 年前想打造一间苹果咖啡厅，而它正是 Apple Store 的前身",
//       "text": "![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png) \n\n #### 乔布斯 20 年前想打造的苹果咖啡厅 \n\n Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划",
//       "btnOrientation": "0",
//       "btns": [
//           {
//               "title": "内容不错",
//               "actionURL": "https://www.dingtalk.com/"
//           },
//           {
//               "title": "不感兴趣",
//               "actionURL": "https://www.dingtalk.com/"
//           }
//       ]
//   }
// }

// {
//   "msgtype":"feedCard",
//   "feedCard": {
//       "links": [
//           {
//               "title": "时代的火车向前开1",
//               "messageURL": "https://www.dingtalk.com/",
//               "picURL": "https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png"
//           },
//           {
//               "title": "时代的火车向前开2",
//               "messageURL": "https://www.dingtalk.com/",
//               "picURL": "https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png"
//           }
//       ]
//   }
// }

interface Notify {
  atMobiles?: string[];
  atUserIds?: string[];
  isAtAll?: boolean;
}

function getUrl(name: string) {
  const url =
    process.env.DINGTALK_BASE_URL ?? 'https://oapi.dingtalk.com/robot/send';
  const botConfigs = JSON.parse(process.env.DINGTALK_BOT_CONFIGS ?? '[]');
  const config = botConfigs.find((config: { name: string }) => config.name === name);
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

async function sendMessage({ name, message, notify }: { name: string, message: Message, notify: Notify }) {
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
  interface MessageResponse {
    // 0 success
    // 400013 群已被解散 请向其他群发消息
    // 400101 access_token不存在 请确认access_token拼写是否正确
    // 400102 机器人已停用 请联系管理员启用机器人
    // 400105 不支持的消息类型 请使用文档中支持的消息类型
    // 400106 机器人不存在 请确认机器人是否在群中
    // 410100 发送速度太快而限流 请降低发送速度
    // 430101 含有不安全的外链 请确认发送的内容合法
    // 430102 含有不合适的文本 请确认发送的内容合法
    // 430103 含有不合适的图片 请确认发送的内容合法
    // 430104 含有不合适的内容 请确认发送的内容合法
    errcode:
      | 0
      | 430101
      | 430102
      | 430103
      | 430104
      | 400013
      | 400101
      | 400102
      | 400105
      | 400106
      | 410100
      | 430101
      | 430102
      | 430103
      | 430104;
    errmsg: string;
  }
  const result: MessageResponse = await response.json();
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
          .array(
            z.object({
              title: z.string(),
              actionURL: z.string(),
            })
          )
          .optional(),
        links: z
          .array(
            z.object({
              title: z.string(),
              messageURL: z.string(),
              picURL: z.string(),
            })
          )
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
