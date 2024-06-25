import { default as mssql } from "mssql";
import type { Notification } from "../types/notification.js";

export class NotificationFetcher {
    constructor(private readonly notificationDB: mssql.ConnectionPool) {}

    async fetch() {
        const fetchRequest = this.notificationDB.request();

        const result = await fetchRequest.execute<Notification>("dbo.notify");

        return result.recordset;
    }

    async acknowledge(notiIds: number[]) {
        const acknowledgeRequest = this.notificationDB.request();

        const tvp = new mssql.Table();
        tvp.columns.add("NotiId", mssql.Int);
        notiIds.forEach((notiId) => {
            tvp.rows.add(notiId);
        });
        acknowledgeRequest.input("NotiIds", tvp);

        await acknowledgeRequest.execute("dbo.acknowledgeNotified");
    }
}
