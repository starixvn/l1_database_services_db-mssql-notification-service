import { asClass, asValue, BaseContainer } from "@ldb/base-container";
import { appRole, databaseConfig, healthcheckPort, lumiLoggerConfig, notificationConfig, schedulerConfig, telegramBotConfig, vaultOptions } from "./app-configs.js";
import { App } from "./app.js";
import { metadata } from "./metadata.js";
import { GrafanaRenderer } from "./modules/grafana-renderer.js";
import { NotificationDispatcher } from "./modules/notification-dispatcher.js";
import { NotificationFetcher } from "./modules/notification-fetcher.js";
import { TelegramBot } from "./modules/telegram-bot.js";
import { Vault } from "./modules/vault.js";

export class Container extends BaseContainer {
    constructor() {
        super();
    }

    register() {
        this.registerLogger(lumiLoggerConfig).registerHealthcheck(metadata, healthcheckPort).registerScheduler(schedulerConfig).registerClasses();
        return this;
    }

    private registerClasses() {
        this.container.register({
            app: asClass(App).singleton(),

            vaultOptions: asValue(vaultOptions),
            appRole: asValue(appRole),
            vault: asClass(Vault).singleton(),

            telegramBotConfig: asValue(telegramBotConfig),
            telegramBot: asClass(TelegramBot).singleton(),

            grafanaRenderer: asClass(GrafanaRenderer).singleton(),

            databaseConfig: asValue(databaseConfig),
            notificationConfig: asValue(notificationConfig),
            notificationFetcher: asClass(NotificationFetcher).singleton(),

            notificationDispatcher: asClass(NotificationDispatcher).singleton(),
        });
        return this;
    }
}
