import { name, version } from "./metadata.js";

export const environment = "PROD";
export const healthcheckPort = 5000;

export const sentrySeverityLevel = "warning";
export const sentryNodeOptions = {
    dsn: "https://24da377728fa4ea98635f5dfff6785d5@sentry.sabagame.com/163",
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
        telegram: -1002231675324,
        teams: "19:f3490c40cff044d8a897f5fd4ff3b51c@thread.tacv2",
    },
    proxy: {
        protocol: "http",
        host: "lisasqd.nebula.prod",
        port: 8801,
    },
};

export const terminalSeverityLevel = "log";

export const databaseConfig = {
    parseJSON: true,
    pool: { min: 1, max: 5, idleTimeoutMillis: 120000 },
    options: { trustServerCertificate: true, appName: `${name}@${version}` },
};

export const vaultOptions = {
    apiVersion: "v1",
    endpoint: "https://10.99.99.188:8200",
};

export const appRole = {
    role_id: "fabc0a3d-3b62-be8f-6c93-1b426e483320",
    secret_id: "cfc254ae-dece-87bd-a85f-f9a31bf1fdb1",
};

export const telegramConfig = {
    telegramBotName: "skynex",
    proxy: "http://lisasqd-dev.nebula.prod:8801",
};

export const eventConfigs = {
    NOTIFY: 5_000,
};
