import { Logger } from "@ldb/logger";
import { Scheduler } from "@ldb/scheduler";
import { SentryLogger } from "@ldb/sentry-logger";
import { SkynexLogger } from "@ldb/skynex-logger";
import { TerminalLogger } from "@ldb/terminal-logger";
import { asClass, asValue, createContainer, InjectionMode, type AwilixContainer, type ResolveOptions } from "awilix";
import { default as mssql } from "mssql";
import { Telegram } from "telegraf";
import {
    environment,
    eventConfigs,
    grafanaConfigs,
    sentryNodeOptions,
    sentryOptions,
    sentrySeverityLevel,
    skynexOptions,
    skynexSeverityLevel,
    telegramConfigs,
    terminalSeverityLevel,
} from "./app-configs.js";
import { App } from "./app.js";
import { GrafanaRenderer } from "./modules/grafana-renderer.js";
import { NotificationDispatcher } from "./modules/notification-dispatcher.js";
import { NotificationFetcher } from "./modules/notification-fetcher.js";

export class Container {
    private readonly container: AwilixContainer;

    constructor() {
        this.container = createContainer({ injectionMode: InjectionMode.CLASSIC });
    }

    register() {
        this.registerLoggers().registerScheduler().registerClasses();
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
            eventConfigs: asValue(eventConfigs),
        });
        return this;
    }

    private registerClasses() {
        this.container.register({
            app: asClass(App).singleton(),
            telegramBot: asClass(Telegram).singleton(),
            token: asValue(telegramConfigs.token),
            options: asValue({}),
            response: asValue({}),
            grafanaRenderer: asClass(GrafanaRenderer).singleton(),
            grafanaToken: asValue(grafanaConfigs.token),
            notificationFetcher: asClass(NotificationFetcher).singleton(),
            notificationDispatcher: asClass(NotificationDispatcher).singleton(),
        });
        return this;
    }

    registerDatabases(notificationDB: mssql.ConnectionPool) {
        this.container.register({
            notificationDB: asValue(notificationDB),
        });
        return this;
    }

    resolve<N extends string>(name: N, resolveOptions?: ResolveOptions) {
        return this.container.resolve(name, resolveOptions);
    }
}
