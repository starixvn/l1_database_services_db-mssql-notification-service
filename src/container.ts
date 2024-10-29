import { Logger } from "@ldb/logger";
import { Scheduler } from "@ldb/scheduler";
import { SentryLogger } from "@ldb/sentry-logger";
import { SkynexLogger } from "@ldb/skynex-logger";
import { TerminalLogger } from "@ldb/terminal-logger";
import { asClass, asValue, createContainer, InjectionMode, type AwilixContainer, type ResolveOptions } from "awilix";
import {
    appRole,
    databaseConfig,
    environment,
    eventConfigs,
    healthcheckPort,
    sentryNodeOptions,
    sentryOptions,
    sentrySeverityLevel,
    skynexOptions,
    skynexSeverityLevel,
    telegramBotConfig,
    terminalSeverityLevel,
    vaultOptions,
} from "./app-configs.js";
import { App } from "./app.js";
import { HealthcheckServer } from "./healthcheck/server.js";
import { GrafanaRenderer } from "./modules/grafana-renderer.js";
import { NotificationDispatcher } from "./modules/notification-dispatcher.js";
import { NotificationFetcher } from "./modules/notification-fetcher.js";
import { TelegramBot } from "./modules/telegram-bot.js";
import { Vault } from "./modules/vault.js";

export class Container {
    private readonly container: AwilixContainer;

    constructor() {
        this.container = createContainer({ injectionMode: InjectionMode.CLASSIC });
    }

    register() {
        this.registerLoggers().registerScheduler().registerClasses().registerHealthcheck();
        return this;
    }

    private registerLoggers() {
        this.container.register({
            terminalLogger: asClass(TerminalLogger).singleton(),
            terminalSeverityLevel: asValue(terminalSeverityLevel),
        });
        this.container.register({
            skynexLogger: asClass(SkynexLogger).singleton(),
            skynexOptions: asValue(skynexOptions),
            skynexSeverityLevel: asValue(skynexSeverityLevel),
        });
        this.container.register({
            sentryLogger: asClass(SentryLogger).singleton(),
            sentryNodeOptions: asValue(sentryNodeOptions),
            sentryOptions: asValue(sentryOptions),
            sentrySeverityLevel: asValue(sentrySeverityLevel),
        });
        this.container.register({
            logger: asClass(Logger).singleton(),
            otherLoggers: asValue(null),
            environment: asValue(environment),
        });
        return this;
    }

    private registerScheduler() {
        this.container.register({
            scheduler: asClass(Scheduler).singleton(),
            schedulerConfig: asValue(eventConfigs),
        });
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
            notificationFetcher: asClass(NotificationFetcher).singleton(),

            notificationDispatcher: asClass(NotificationDispatcher).singleton(),
        });
        return this;
    }

    private registerHealthcheck() {
        this.container.register({
            healthcheckServer: asClass(HealthcheckServer).singleton(),
            healthcheckPort: asValue(healthcheckPort),
        });
        return this;
    }

    resolve<N extends string>(name: N, resolveOptions?: ResolveOptions) {
        return this.container.resolve(name, resolveOptions);
    }
}
