import type { BaseLogger } from "@ldb/logger";
import type { Scheduler } from "@ldb/scheduler";
import { Subscriber } from "@ldb/utils";
import type { Message } from "@telegraf/types";
import type { GrafanaNotification, MessageNotification, Notification, PhotoNotification } from "../types/notification.js";
import type { SchedulerEvents, SchedulerKeys } from "../types/scheduler.js";
import type { GrafanaRenderer } from "./grafana-renderer.js";
import type { NotificationFetcher } from "./notification-fetcher.js";
import type { TelegramBot } from "./telegram-bot.js";

export class NotificationDispatcher extends Subscriber<SchedulerEvents> {
    constructor(
        private readonly notificationFetcher: NotificationFetcher,
        private readonly telegramBot: TelegramBot,
        private readonly grafanaRenderer: GrafanaRenderer,
        logger: BaseLogger,
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
        const result = await this.telegramBot.sendMessage(ConversationId, Content);

        return this.parseResult(result, NotiId);
    }

    private async sendPhoto(notification: PhotoNotification) {
        const { Content, ConversationId, NotiId } = notification;
        const result = await this.telegramBot.sendPhoto(ConversationId, { url: Content });

        return this.parseResult(result, NotiId);
    }

    private async sendGrafanaPhoto(notification: GrafanaNotification) {
        const { Content, ConversationId, NotiId } = notification;
        const source = await this.grafanaRenderer.render(Content);

        if (!source) {
            throw new Error();
        }

        const result = await this.telegramBot.sendPhoto(ConversationId, { source });

        return this.parseResult(result, NotiId);
    }

    private parseResult(result: Message | null, NotiId: number) {
        if (result) {
            return [NotiId, result.message_id] as const;
        } else {
            return null;
        }
    }

    subscribe(publisher: Scheduler<SchedulerKeys>) {
        return super.subscribe(publisher, "NOTIFY", this.notify);
    }

    unsubscribe(publisher: Scheduler<SchedulerKeys>) {
        return super.unsubscribe(publisher, "NOTIFY", this.notify);
    }
}
