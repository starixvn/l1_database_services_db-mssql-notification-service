/** @typedef {import("@ldb/logger").LumiLoggerConfig} LumiLoggerConfig */

import { name, version } from "./metadata.js";

export const environment = "KLPROD";
export const healthcheckPort = 5000;

/** @type {LumiLoggerConfig} */
export const lumiLoggerConfig = {
    sentryNodeOptions: {
        dsn: "http://4005f766732360f4cfad4f9f5e4fbf16@sentrypro-sc.ops-klprod.gamora.prod/24",
        environment,
        initialScope: {
            tags: { service: name },
        },
        release: `${name}@${version}`,
    },
    skynexOptions: {
        conversationIds: {
            telegram: -1001893615808,
            slack: "B08GPPK88MS:T08ACMHMMFS:C090GANNXP1",
        },
        proxy: {
            protocol: "http",
            host: "iusqd.gamora.prod",
            port: 8801,
        },
    },
    environment,
};

export const databaseConfig = {
    parseJSON: true,
    pool: { min: 1, max: 5, idleTimeoutMillis: 120000 },
    options: { trustServerCertificate: true, appName: `${name}@${version}` },
};

export const vaultOptions = {
    apiVersion: "v1",
    endpoint: "https://10.146.34.28:8200",
};

export const appRole = {
    role_id: "fabc0a3d-3b62-be8f-6c93-1b426e483320",
    secret_id: "cfc254ae-dece-87bd-a85f-f9a31bf1fdb1",
};

export const notificationConfig = {
    notifierVaultKey: "notifier",
};

export const telegramBotConfig = {
    telegramBotName: "skynex",
    proxy: "http://iusqd.gamora.prod:8801",
};

export const schedulerConfig = {
    NOTIFY: [5_000, 0],
};

export const customHosts = {
    "ops3.starixplay.com": "10.148.58.11",
    "aegis.starixplay.com": "10.148.58.11",
};
