import { z } from 'zod';
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
    text: string;
    btnOrientation?: '0' | '1';
    singleTitle?: string;
    singleURL?: string;
    btns?: Array<{
        title: string;
        actionURL: string;
    }>;
}
interface FeedCardMessage {
    type: 'feedCard';
    links: Array<{
        title: string;
        messageURL: string;
        picURL: string;
    }>;
}
type Message = TextMessage | LinkMessage | MarkdownMessage | ActionCardMessage | FeedCardMessage;
interface Notify {
    atMobiles?: string[];
    atUserIds?: string[];
    isAtAll?: boolean;
}
declare function sendMessage({ name, message, notify }: {
    name: string;
    message: Message;
    notify: Notify;
}): Promise<{
    content: {
        type: string;
        text: string;
    }[];
}>;
export declare const tools: {
    name: string;
    description: string;
    parameters: z.ZodObject<{
        name: z.ZodString;
        message: z.ZodObject<{
            type: z.ZodEnum<["text", "link", "markdown", "actionCard", "feedCard"]>;
            content: z.ZodOptional<z.ZodString>;
            text: z.ZodOptional<z.ZodString>;
            title: z.ZodOptional<z.ZodString>;
            picUrl: z.ZodOptional<z.ZodString>;
            messageUrl: z.ZodOptional<z.ZodString>;
            btnOrientation: z.ZodOptional<z.ZodEnum<["0", "1"]>>;
            singleTitle: z.ZodOptional<z.ZodString>;
            singleURL: z.ZodOptional<z.ZodString>;
            btns: z.ZodOptional<z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                actionURL: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                actionURL: string;
            }, {
                title: string;
                actionURL: string;
            }>, "many">>;
            links: z.ZodOptional<z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                messageURL: z.ZodString;
                picURL: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                title: string;
                messageURL: string;
                picURL: string;
            }, {
                title: string;
                messageURL: string;
                picURL: string;
            }>, "many">>;
        }, "strip", z.ZodTypeAny, {
            type: "text" | "link" | "markdown" | "actionCard" | "feedCard";
            text?: string | undefined;
            links?: {
                title: string;
                messageURL: string;
                picURL: string;
            }[] | undefined;
            title?: string | undefined;
            btnOrientation?: "0" | "1" | undefined;
            singleTitle?: string | undefined;
            singleURL?: string | undefined;
            btns?: {
                title: string;
                actionURL: string;
            }[] | undefined;
            picUrl?: string | undefined;
            messageUrl?: string | undefined;
            content?: string | undefined;
        }, {
            type: "text" | "link" | "markdown" | "actionCard" | "feedCard";
            text?: string | undefined;
            links?: {
                title: string;
                messageURL: string;
                picURL: string;
            }[] | undefined;
            title?: string | undefined;
            btnOrientation?: "0" | "1" | undefined;
            singleTitle?: string | undefined;
            singleURL?: string | undefined;
            btns?: {
                title: string;
                actionURL: string;
            }[] | undefined;
            picUrl?: string | undefined;
            messageUrl?: string | undefined;
            content?: string | undefined;
        }>;
        notify: z.ZodObject<{
            atMobiles: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            atUserIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            isAtAll: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            atMobiles?: string[] | undefined;
            atUserIds?: string[] | undefined;
            isAtAll?: boolean | undefined;
        }, {
            atMobiles?: string[] | undefined;
            atUserIds?: string[] | undefined;
            isAtAll?: boolean | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        message: {
            type: "text" | "link" | "markdown" | "actionCard" | "feedCard";
            text?: string | undefined;
            links?: {
                title: string;
                messageURL: string;
                picURL: string;
            }[] | undefined;
            title?: string | undefined;
            btnOrientation?: "0" | "1" | undefined;
            singleTitle?: string | undefined;
            singleURL?: string | undefined;
            btns?: {
                title: string;
                actionURL: string;
            }[] | undefined;
            picUrl?: string | undefined;
            messageUrl?: string | undefined;
            content?: string | undefined;
        };
        notify: {
            atMobiles?: string[] | undefined;
            atUserIds?: string[] | undefined;
            isAtAll?: boolean | undefined;
        };
    }, {
        name: string;
        message: {
            type: "text" | "link" | "markdown" | "actionCard" | "feedCard";
            text?: string | undefined;
            links?: {
                title: string;
                messageURL: string;
                picURL: string;
            }[] | undefined;
            title?: string | undefined;
            btnOrientation?: "0" | "1" | undefined;
            singleTitle?: string | undefined;
            singleURL?: string | undefined;
            btns?: {
                title: string;
                actionURL: string;
            }[] | undefined;
            picUrl?: string | undefined;
            messageUrl?: string | undefined;
            content?: string | undefined;
        };
        notify: {
            atMobiles?: string[] | undefined;
            atUserIds?: string[] | undefined;
            isAtAll?: boolean | undefined;
        };
    }>;
    execute: typeof sendMessage;
}[];
export {};
