# MCP Server DingTalk

A Model Context Protocol (MCP) server for DingTalk integration.

## Features

- 🤖 DingTalk bot message sending capabilities
- 📦 Multiple message types support (text, link, markdown, actionCard, feedCard)
- 🔐 Secure webhook signing with HMAC-SHA256
- 🎯 TypeScript support with strict type checking

## Prerequisites

- Node.js 18+

## Usage

```json
{
    "mcp-server-dingtalk": {
        "transport": "stdio",
        "command": "npx",
        "args": [
            "-y",
            "mcp-server-dingtalk"
        ],
        "env": {
            "DINGTALK_BOT_CONFIGS": "[{\"name\": \"your-bot-name\", \"accessToken\": \"your-access-token\", \"signSecret\": \"your-sign-secret\"}]"
        }
    }
}
```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DINGTALK_BASE_URL` | DingTalk API base URL | No | `https://oapi.dingtalk.com/robot/send` |
| `DINGTALK_BOT_CONFIGS` | JSON array of bot configurations | Yes | `[]` |

### Available Tools

The server provides the following MCP tool:

#### `dingtalk_bot_send_message`

Send messages to DingTalk chat groups via configured bots.

**Parameters:**
- `name` (string): Bot name for sending messages
- `message` (object): Message content with type-specific fields
- `notify` (object): Notification settings for @ mentions

**Supported Message Types:**

1. **Text Message**
   ```json
   {
     "type": "text",
     "content": "Hello, World!"
   }
   ```

2. **Link Message**
   ```json
   {
     "type": "link",
     "text": "Link description",
     "title": "Link Title",
     "messageUrl": "https://example.com"
   }
   ```

3. **Markdown Message**
   ```json
   {
     "type": "markdown",
     "title": "Markdown Title",
     "text": "## Markdown Content\n- Item 1\n- Item 2"
   }
   ```

4. **Action Card Message**
   ```json
   {
     "type": "actionCard",
     "title": "Action Card Title",
     "text": "Action card content",
     "singleTitle": "Read More",
     "singleURL": "https://example.com"
   }
   ```

5. **Feed Card Message**
   ```json
   {
     "type": "feedCard",
     "links": [
       {
         "title": "Feed Item",
         "messageURL": "https://example.com",
         "picURL": "https://example.com/image.png"
       }
     ]
   }
   ```


## License

MIT
