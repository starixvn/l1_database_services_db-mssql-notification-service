import type { BaseLogger } from "@ldb/base-logger";
import vault, { type client, type VaultOptions } from "node-vault";

export type AppRole = {
    role_id: string;
    secret_id: string;
};

export class Vault {
    private readonly vault: client;
    constructor(vaultOptions: VaultOptions, private readonly appRole: AppRole, private readonly logger: BaseLogger) {
        this.vault = vault(vaultOptions);
    }

    get className() {
        return this.constructor.name;
    }

    async initVault() {
        const token = await this.vault.approleLogin(this.appRole);
        this.vault.token = token.auth.client_token;
    }

    async read<T>(path: string): Promise<T> {
        try {
            const { data } = await this.vault.read(path);
            return data.data;
        } catch (error) {
            if (error instanceof Error) {
                Object.assign(error, { path });
            } else {
                error = { error, path };
            }
            this.handleError(error, "read");
            throw error;
        }
    }

    private handleError(error: unknown, component: string) {
        this.logger.logError({ title: `${this.className}.${component}`, message: error });
    }
}
