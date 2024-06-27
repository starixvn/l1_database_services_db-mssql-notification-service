import type { BaseLogger } from "@ldb/base-logger";
import type { Vault } from "./vault.js";

type GrafanaVaultToken = { token: string };

export class GrafanaRenderer {
    constructor(private readonly vault: Vault, private readonly logger: BaseLogger) {}

    get className() {
        return this.constructor.name;
    }

    private async getToken(url: string) {
        const { hostname } = new URL(url);
        const { token } = await this.vault.read<GrafanaVaultToken>(`/db-services/data/grafana/renderer/${hostname}`);
        return `Bearer ${token}`;
    }

    async render(url: string) {
        const headers = { Authorization: await this.getToken(url) };
        const response = await fetch(url, { headers });

        if (response.status !== 200) {
            const { status, statusText } = response;
            this.handleError({ status, statusText, url }, "render");
            return null;
        }

        const blob = await response.blob();
        return Buffer.from(await blob.arrayBuffer());
    }

    private handleError(error: unknown, component: string) {
        this.logger.logError({ title: `${this.className}.${component}`, message: error });
    }
}
