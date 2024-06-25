import type { BaseLogger } from "@ldb/base-logger";

export class GrafanaRenderer {
    private Authorization: string;
    constructor(grafanaToken: string, private readonly logger: BaseLogger) {
        this.Authorization = `Bearer ${grafanaToken}`;
    }

    get className() {
        return this.constructor.name;
    }

    async render(url: string) {
        const headers = { Authorization: this.Authorization };
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
