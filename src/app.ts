import { BaseApp } from "@ldb/base-app";
import type { BaseLogger } from "@ldb/logger";
import type { Scheduler } from "@ldb/scheduler";
import type { Metadata } from "@ldb/utils";
import type { NotificationDispatcher } from "./modules/notification-dispatcher.js";
import type { NotificationFetcher } from "./modules/notification-fetcher.js";
import type { TelegramBot } from "./modules/telegram-bot.js";
import type { Vault } from "./modules/vault.js";
import type { SchedulerKeys } from "./types/scheduler.js";
import "./workaround.js";

export class App extends BaseApp {
    constructor(
        private readonly scheduler: Scheduler<SchedulerKeys>,
        private readonly vault: Vault,
        private readonly telegramBot: TelegramBot,
        private readonly notificationFetcher: NotificationFetcher,
        private readonly notificationDispatcher: NotificationDispatcher,
        metadata: Metadata,
        logger: BaseLogger,
    ) {
        super(metadata, logger);
    }

    async initiate() {
        await this.vault.initVault();
        await this.notificationFetcher.connectDatabase();
        await this.telegramBot.checkBot();
        this.notificationDispatcher.subscribe(this.scheduler);
        super.initiate();
    }

    terminate() {
        this.notificationDispatcher.unsubscribe(this.scheduler);
        super.terminate();
    }
}
