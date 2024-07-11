import { globalAgent } from "https";
import { dirname, resolve } from "path";
import { create } from "ssl-root-cas";
import { Agent, setGlobalDispatcher } from "undici";
import { fileURLToPath } from "url";

const CAs = create().addFile(resolve(dirname(fileURLToPath(import.meta.url)), "./root-ca.cert.pem"));
globalAgent.options.ca = CAs;

const dispatcher = new Agent({ connect: { ca: globalAgent.options.ca } });
setGlobalDispatcher(dispatcher);

export { CAs };
