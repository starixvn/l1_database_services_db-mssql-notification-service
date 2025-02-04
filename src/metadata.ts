import type { Metadata } from "@ldb/utils";

export const name = "mssql-notification-service" as const;
export const version = "1.1.0-rc.0" as const;

export const metadata = { name, version } as const satisfies Metadata;
