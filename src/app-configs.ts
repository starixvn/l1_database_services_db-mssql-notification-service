import type { SeverityLevel } from "@ldb/base-logger";
import type { NodeOptions, SentryOptions } from "@ldb/sentry-logger";
import type { SkynexOptions } from "@ldb/skynex-logger";
import { config } from "mssql";
import { name, version } from "./metadata.js";
import type { SchedulerConfigs } from "./types/scheduler.js";

export const environment = "DEV" as const;
export const healthcheckPort = 5000 as const;

export const sentrySeverityLevel = "warning" as const satisfies SeverityLevel;
export const sentryNodeOptions = {
    dsn: "https://098a0c6ad1d74e8eb39ec7df895e59e0@sentry.lumigame.com/76",
    environment,
    initialScope: {
        tags: { service: name },
    },
    release: `${name}@${version}`,
} as const satisfies NodeOptions;
export const sentryOptions = {} as const satisfies SentryOptions;

export const skynexSeverityLevel = "warning" as const satisfies SeverityLevel;
export const skynexOptions = {
    conversationIds: {
        telegram: -1001911631568,
        teams: "19:11eb3bf6c3c240fd993eb8048615835c@thread.tacv2",
    },
} as const satisfies SkynexOptions;

export const terminalSeverityLevel = "debug" as const satisfies SeverityLevel;

export const notiDBConfig = {
    server: "10.10.50.14",
    port: 1433,
    user: "notifier",
    password: "Notifier",
    database: "NotificationDB",
    parseJSON: true,
    pool: { min: 1, max: 5, idleTimeoutMillis: 120000 },
    options: { trustServerCertificate: true, appName: `${name}@${version}` },
} as const satisfies config;

export const grafanaConfigs = {
    token: "glsa_126MwojqPuttdwolGjXaFwnf3bEQcuzm_bb7cf7c2",
} as const;

export const telegramConfigs = {
    token: "5210188329:AAHcc_CHa_tgs5vN9IWGaiM6NRAQQSqNLgs",
} as const;

export const eventConfigs = {
    NOTIFY: 10_000,
} as const satisfies SchedulerConfigs;
