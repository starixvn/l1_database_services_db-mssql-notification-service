import type { BaseLogger } from "@ldb/base-logger";
import type { Message } from "@telegraf/types";
import { HttpProxyAgent } from "http-proxy-agent";
import { Telegram } from "telegraf";
import type { InputFile } from "telegraf/typings/core/types/typegram.js";
import type { FmtString } from "telegraf/typings/format.js";
import type { ExtraPhoto, ExtraReplyMessage } from "telegraf/typings/telegram-types.js";
import type { Vault } from "./vault.js";

type TelegramVaultToken = { token: string };

const MESSAGE_OPTIONS = {
    link_preview_options: { is_disabled: true },
    parse_mode: "MarkdownV2",
} as const satisfies ExtraReplyMessage;

const PHOTO_OPTIONS = {} as const satisfies ExtraPhoto;

export type TelegramBotConfig = {
    telegramBotName: string;
    proxy?: string | URL;
};

export class TelegramBot {
    private bot = new Telegram("");
    private proxy?: HttpProxyAgent<string>;

    constructor(private readonly telegramBotConfig: TelegramBotConfig, private readonly vault: Vault, private readonly logger: BaseLogger) {
        if (telegramBotConfig.proxy) {
            this.proxy = new HttpProxyAgent(telegramBotConfig.proxy);
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

    async sendMessage(chatId: number | string, text: string | FmtString): Promise<Message.TextMessage | null> {
        try {
            return await this.bot.sendMessage(chatId, text, MESSAGE_OPTIONS);
        } catch (error: unknown) {
            this.handleError(error, "sendMessage");
            return null;
        }
    }

    async sendPhoto(chatId: number | string, photo: string | InputFile) {
        try {
            return await this.bot.sendPhoto(chatId, photo, PHOTO_OPTIONS);
        } catch (error: unknown) {
            this.handleError(error, "sendPhoto");
            return null;
        }
    }
}
