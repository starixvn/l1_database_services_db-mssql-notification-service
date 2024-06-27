import type { BaseLogger } from "@ldb/base-logger";
import type { Scheduler } from "@ldb/scheduler";
import { name, version } from "./metadata.js";
import type { NotificationDispatcher } from "./modules/notification-dispatcher.js";
import type { NotificationFetcher } from "./modules/notification-fetcher.js";
import type { TelegramBot } from "./modules/telegram-bot.js";
import type { Vault } from "./modules/vault.js";
import { CAs } from "./root-cas.js";

let exiting = false;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class App {
    constructor(
        private readonly scheduler: Scheduler,
        private readonly vault: Vault,
        private readonly telegramBot: TelegramBot,
        private readonly notificationFetcher: NotificationFetcher,
        private readonly notificationDispatcher: NotificationDispatcher,
        private readonly logger: BaseLogger
    ) {
        this.selfBound();
        this.handleExceptions();
    }

    get className() {
        return this.constructor.name;
    }

    private selfBound() {
        this.handleUncaughtException = this.handleUncaughtException.bind(this);
        this.handleUnhandledRejection = this.handleUnhandledRejection.bind(this);
    }

    private handleExceptions() {
        process.addListener("uncaughtException", this.handleUncaughtException);
        process.addListener("unhandledRejection", this.handleUnhandledRejection);
    }

    private async handleUncaughtException(error: Error, origin: NodeJS.UncaughtExceptionOrigin) {
        while (exiting) {
            await wait(1_000);
        }

        exiting = true;
        this.logger.logFatal({ title: name, message: error }, { tags: { event: "uncaughtException" }, extra: { error, origin } });

        await wait(5_000);
        process.exit(10);
    }

    private async handleUnhandledRejection(reason: unknown, promise: Promise<unknown>) {
        while (exiting) {
            await wait(5_000);
        }

        exiting = true;
        this.logger.logFatal({ title: name, message: reason }, { tags: { event: "unhandledRejection" }, extra: { reason, promise } });

        await wait(5_000);
        process.exit(20);
    }

    async initiate() {
        CAs;
        await this.vault.initVault();
        await this.notificationFetcher.connectDatabase();
        await this.telegramBot.checkBot();
        this.notificationDispatcher.subscribe(this.scheduler);
        this.logger.logWarning({ title: `${name}@${version}`, message: "App has been started." });
    }
}
