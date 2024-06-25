import type { BaseLogger } from "@ldb/base-logger";
import type { Scheduler } from "@ldb/scheduler";
import type { Telegram } from "telegraf";
import type { ExtraPhoto, ExtraReplyMessage } from "telegraf/typings/telegram-types.js";
import type { GrafanaNotification, MessageNotification, Notification, PhotoNotification } from "../types/notification.js";
import type { SchedulerEvents, SchedulerKeys } from "../types/scheduler.js";
import type { GrafanaRenderer } from "./grafana-renderer.js";
import type { NotificationFetcher } from "./notification-fetcher.js";
import { Subscriber } from "./subscriber.js";

const MESSAGE_OPTIONS = {
    link_preview_options: { is_disabled: true },
    parse_mode: "MarkdownV2",
} as const satisfies ExtraReplyMessage;

const PHOTO_OPTIONS = {} as const satisfies ExtraPhoto;

export class NotificationDispatcher extends Subscriber<SchedulerKeys, SchedulerEvents, Scheduler> {
    constructor(
        private readonly notificationFetcher: NotificationFetcher,
        private readonly telegramBot: Telegram,
        private readonly grafanaRenderer: GrafanaRenderer,
        logger: BaseLogger
    ) {
        super(logger);
        this.selfBound();
    }

    private selfBound() {
        this.notify = this.notify.bind(this);
    }

    private async notify() {
        await this.fetchNotifications();
    }

    private async fetchNotifications() {
        const notifications = await this.notificationFetcher.fetch();

        const notiIds: number[] = [];
        for (const notification of notifications) {
            const result = await this.sendNotification(notification);
            const [notiId, messageId] = result ?? [];
            if (notiId) {
                this.logger.logDebug({ title: this.className, message: "Notification sent" }, { extra: { notiId, messageId, ...notification } });
                notiIds.push(notiId);
            }
        }

        await this.notificationFetcher.acknowledge(notiIds);
    }

    private async sendNotification(notification: Notification) {
        const { ContentType } = notification;

        switch (ContentType) {
            case "Message":
                return this.sendMessage(notification);
            case "Photo":
                return this.sendPhoto(notification);
            case "Grafana":
                return this.sendGrafanaPhoto(notification);
            default:
                return null;
        }
    }

    private async sendMessage(notification: MessageNotification) {
        const { Content, ConversationId, NotiId } = notification;
        const { message_id: messageId } = await this.telegramBot.sendMessage(ConversationId, Content, MESSAGE_OPTIONS);
        return [NotiId, messageId] as const;
    }

    private async sendPhoto(notification: PhotoNotification) {
        const { Content, ConversationId, NotiId } = notification;
        const { message_id: messageId } = await this.telegramBot.sendPhoto(ConversationId, { url: Content }, PHOTO_OPTIONS);
        return [NotiId, messageId] as const;
    }

    private async sendGrafanaPhoto(notification: GrafanaNotification) {
        const { Content, ConversationId, NotiId } = notification;
        const source = await this.grafanaRenderer.render(Content);

        if (!source) {
            throw new Error();
        }

        const { message_id: messageId } = await this.telegramBot.sendPhoto(ConversationId, { source }, PHOTO_OPTIONS);
        return [NotiId, messageId] as const;
    }

    subscribe(publisher: Scheduler) {
        return super.subscribe(publisher, "NOTIFY", this.notify);
    }

    unsubscribe(publisher: Scheduler) {
        return super.unsubscribe(publisher, "NOTIFY", this.notify);
    }
}
