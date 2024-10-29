import { name, version } from "./metadata.js";

export const environment = "LOCAL";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "https://098a0c6ad1d74e8eb39ec7df895e59e0@sentry.lumigame.com/76",
    environment,
    initialScope: {
        tags: { service: name },
    },
    release: `${name}@${version}`,
};
export const sentryOptions = {};

export const skynexSeverityLevel = "warning";
export const skynexOptions = {
    conversationIds: {
        telegram: -1002152418879,
        teams: "19:f3490c40cff044d8a897f5fd4ff3b51c@thread.tacv2",
    },
};

export const terminalSeverityLevel = "debug";

export const databaseConfig = {
    parseJSON: true,
    pool: { min: 1, max: 5, idleTimeoutMillis: 120000 },
    options: { trustServerCertificate: true, appName: `${name}@${version}` },
};

export const vaultOptions = {
    apiVersion: "v1",
    endpoint: "https://10.10.50.14:8200",
};

export const appRole = {
    role_id: "2be55181-6c8c-4bee-f886-d97063c0594b",
    secret_id: "d62c7ae8-b134-f36d-0e75-6f2181951d8e",
};

export const telegramBotConfig = {
    telegramBotName: "skynex",
};

export const eventConfigs = {
    NOTIFY: [5_000, 0],
};
