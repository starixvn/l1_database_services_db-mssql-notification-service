import { globalAgent } from "https";
import { dirname, resolve } from "path";
import { create } from "ssl-root-cas";
import { fileURLToPath } from "url";

const CAs = create().addFile(resolve(dirname(fileURLToPath(import.meta.url)), "./root-ca.cert.pem"));
globalAgent.options.ca = CAs;

export { CAs };
