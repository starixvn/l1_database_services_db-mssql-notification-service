import type { LumiLoggerConfig } from "@ldb/logger";
import { config } from "mssql";
import type { VaultOptions } from "node-vault";
import { name, version } from "./metadata.js";
import type { TelegramBotConfig } from "./modules/telegram-bot.js";
import type { AppRole } from "./modules/vault.js";
import type { SchedulerConfigs } from "./types/scheduler.js";

export const environment = "DEV" as const;
export const healthcheckPort = 5000 as const;

export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "https://098a0c6ad1d74e8eb39ec7df895e59e0@sentry.lumigame.com/76",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1001911631568,
            teams: "19:11eb3bf6c3c240fd993eb8048615835c@thread.tacv2",
        },
    },
    environment,
    terminalSeverityLevel: "debug",
} as const satisfies LumiLoggerConfig;

export const databaseConfig = {
    parseJSON: true,
    pool: { min: 1, max: 5, idleTimeoutMillis: 120000 },
    options: {
        encrypt: true,
        trustServerCertificate: true,
        appName: `${name}@${version}`,
    },
} as const satisfies Partial<config>;

export const vaultOptions = {
    apiVersion: "v1",
    endpoint: "https://10.10.50.14:8200",
} as const satisfies VaultOptions;

export const appRole = {
    role_id: "2be55181-6c8c-4bee-f886-d97063c0594b",
    secret_id: "d62c7ae8-b134-f36d-0e75-6f2181951d8e",
} as const satisfies AppRole;

export const telegramBotConfig = {
    telegramBotName: "debug",
} as const satisfies TelegramBotConfig;

export const schedulerConfig = {
    NOTIFY: [5_000, 0],
} as const satisfies SchedulerConfigs;
