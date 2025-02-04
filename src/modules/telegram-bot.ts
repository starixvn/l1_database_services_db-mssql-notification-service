import type { BaseLogger } from "@ldb/logger";
import type { Message } from "@telegraf/types";
import { HttpsProxyAgent } from "https-proxy-agent";
import { Telegram } from "telegraf";
import type { FmtString } from "telegraf/format";
import type { Convenience, InputFile } from "telegraf/types";
import type { Vault } from "./vault.js";

type TelegramVaultToken = { token: string };

const MESSAGE_OPTIONS = {
    link_preview_options: { is_disabled: true },
    parse_mode: "MarkdownV2",
} as const satisfies Convenience.ExtraReplyMessage;

const PHOTO_OPTIONS = {} as const satisfies Convenience.ExtraPhoto;

export type TelegramBotConfig = {
    telegramBotName: string;
    proxy?: string | URL;
};

export class TelegramBot {
    private bot = new Telegram("");
    private proxy?: HttpsProxyAgent<string>;

    constructor(
        private readonly telegramBotConfig: TelegramBotConfig,
        private readonly vault: Vault,
        private readonly logger: BaseLogger,
    ) {
        if (telegramBotConfig.proxy) {
            this.proxy = new HttpsProxyAgent(telegramBotConfig.proxy);
        }
    }

    get className() {
        return this.constructor.name;
    }

    async checkBot() {
        try {
            await this.bot.getMe();
        } catch {
            await this.respawnBot();
        }

        return this.bot;
    }

    private async respawnBot() {
        const telegramToken = await this.getToken();
        this.bot = new Telegram(telegramToken, { agent: this.proxy });
    }

    private async getToken() {
        const { token } = await this.vault.read<TelegramVaultToken>(`/db-services/data/telegram/${this.telegramBotConfig.telegramBotName}`);
        return token;
    }

    private handleError(error: unknown, component: string) {
        this.checkBot();
        this.logger.logError({ title: `${this.className}.${component}`, message: error });
    }

    async sendMessage(chatId: number | string, text: string | FmtString, topicId?: number): Promise<Message.TextMessage | null> {
        try {
            const extra: Convenience.ExtraReplyMessage = topicId ? { message_thread_id: topicId, ...MESSAGE_OPTIONS } : MESSAGE_OPTIONS;
            return await this.bot.sendMessage(chatId, text, extra);
        } catch (error: unknown) {
            this.handleError(error, "sendMessage");
            return null;
        }
    }

    async sendPhoto(chatId: number | string, photo: string | InputFile, topicId?: number) {
        try {
            const extra: Convenience.ExtraPhoto = topicId ? { message_thread_id: topicId, ...PHOTO_OPTIONS } : PHOTO_OPTIONS;
            return await this.bot.sendPhoto(chatId, photo, extra);
        } catch (error: unknown) {
            this.handleError(error, "sendPhoto");
            return null;
        }
    }
}
