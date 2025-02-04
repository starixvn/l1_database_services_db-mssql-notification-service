import type { Metadata } from "@ldb/utils";

export const name = "mssql-notification-service" as const;
export const version = "1.1.1" as const;

export const metadata = { name, version } as const satisfies Metadata;
