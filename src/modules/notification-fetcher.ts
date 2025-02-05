import type { BaseLogger } from "@ldb/logger";
import { default as mssql } from "mssql";
import type { Notification } from "../types/notification.js";
import type { Vault } from "./vault.js";

type DatabaseVaultCredential = Pick<mssql.config, "server" | "port" | "database" | "user" | "password">;

export class NotificationFetcher {
    private notificationDB!: mssql.ConnectionPool;

    constructor(
        private readonly vault: Vault,
        private readonly notificationConfig: NotificationConfig,
        private readonly databaseConfig: mssql.config,
        private readonly logger: BaseLogger,
    ) {}

    get className() {
        return this.constructor.name;
    }

    async connectDatabase() {
        const credential = await this.getCredential();
        const config = { ...this.databaseConfig, ...credential } as const satisfies mssql.config;

        const oldConn = this.notificationDB;
        this.notificationDB = await mssql.connect(config);

        if (oldConn) {
            oldConn.close();
        }
    }

    private async getCredential() {
        return await this.vault.read<DatabaseVaultCredential>(`/db-services/data/mssql/${this.notificationConfig.notifierVaultKey}`);
    }

    async fetch() {
        try {
            return await this.doFetch();
        } catch (error: unknown) {
            this.handleError(error, "fetch");
            await this.connectDatabase();
            return await this.doFetch();
        }
    }

    private async doFetch() {
        const fetchRequest = this.notificationDB.request();

        const result = await fetchRequest.execute<Notification>("dbo.notify");

        return result.recordset;
    }

    async acknowledge(notiIds: number[]) {
        try {
            return await this.doAcknowledge(notiIds);
        } catch (error: unknown) {
            this.handleError(error, "acknowledge");
            await this.connectDatabase();
            return await this.doAcknowledge(notiIds);
        }
    }

    private async doAcknowledge(notiIds: number[]) {
        const acknowledgeRequest = this.notificationDB.request();

        const tvp = new mssql.Table();
        tvp.columns.add("NotiId", mssql.Int);
        notiIds.forEach((notiId) => {
            tvp.rows.add(notiId);
        });
        acknowledgeRequest.input("NotiIds", tvp);

        await acknowledgeRequest.execute("dbo.acknowledgeNotified");
    }

    async retry(notiIds: number[]) {
        try {
            return await this.doRetry(notiIds);
        } catch (error: unknown) {
            this.handleError(error, "retry");
            await this.connectDatabase();
            return await this.doRetry(notiIds);
        }
    }

    private async doRetry(notiIds: number[]) {
        const retryRequest = this.notificationDB.request();

        const tvp = new mssql.Table();
        tvp.columns.add("NotiId", mssql.Int);
        notiIds.forEach((notiId) => {
            tvp.rows.add(notiId);
        });
        retryRequest.input("NotiIds", tvp);

        await retryRequest.execute("dbo.retryFailed");
    }

    private handleError(error: unknown, component: string) {
        this.connectDatabase();
        this.logger.logError({ title: `${this.className}.${component}`, message: error });
    }
}

export type NotificationConfig = {
    notifierVaultKey: string;
};
