import type { BaseLogger } from "@ldb/logger";
import vault, { type client, type VaultOptions } from "node-vault";

export class Vault {
    private nextTimeout?: NodeJS.Timeout;

    private readonly vault: client;
    constructor(
        vaultOptions: VaultOptions,
        private readonly appRole: AppRole,
        private readonly logger: BaseLogger,
    ) {
        this.vault = vault(vaultOptions);
        this.selfBound();
    }

    get className() {
        return this.constructor.name;
    }

    private selfBound() {
        this.initVault = this.initVault.bind(this);
    }

    async initVault() {
        if (this.nextTimeout) {
            clearTimeout(this.nextTimeout);
        }

        const token: AppRoleResponse = await this.vault.approleLogin(this.appRole);
        this.vault.token = token.auth.client_token;

        const timeoutMs = (token.auth.lease_duration / 2) * 1000;
        this.nextTimeout = setTimeout(this.initVault, timeoutMs);
        this.logger.logDebug({ title: `${this.className}.initVault`, message: `Next login in ${timeoutMs / 1000}s.` });
    }

    async read<T>(path: string): Promise<T> {
        try {
            const { data } = await this.vault.read(path);
            return data.data;
        } catch (error) {
            let cookedError: unknown;
            if (error instanceof Error) {
                cookedError = Object.assign(error, { path });
            } else {
                cookedError = { error, path };
            }
            this.handleError(cookedError, "read");
            throw cookedError;
        }
    }

    private handleError(error: unknown, component: string) {
        this.logger.logError({ title: `${this.className}.${component}`, message: error });
    }
}

export type AppRole = {
    role_id: string;
    secret_id: string;
};

export type Auth = {
    client_token: string;
    accessor: string;
    policies: string[];
    token_policies: string[];
    metadata: object;
    lease_duration: number;
    renewable: boolean;
    entity_id: string;
    token_type: string;
    orphan: boolean;
    num_uses: number;
};

export type AppRoleResponse = {
    request_id: string;
    lease_id: string;
    renewable: boolean;
    lease_duration: number;
    data: object | null;
    wrap_info: string | null;
    warnings: string | null;
    auth: Auth;
    mount_type: string;
};
