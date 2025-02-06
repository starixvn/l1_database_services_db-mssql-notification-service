import type { Metadata } from "@ldb/utils";

export const name = "mssql-notification-service" as const;
export const version = "2.0.0" as const;

export const metadata = { name, version } as const satisfies Metadata;
