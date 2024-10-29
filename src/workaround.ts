import { globalAgent } from "https";
import { setDefaultAutoSelectFamily } from "net";
import { dirname, resolve } from "path";
import { create } from "ssl-root-cas";
import { Agent, setGlobalDispatcher } from "undici";
import { fileURLToPath } from "url";

const CAs = create().addFile(resolve(dirname(fileURLToPath(import.meta.url)), "./root-ca.cert.pem"));

// Set CAs for `https`
globalAgent.options.ca = CAs;

// Set CAs for `undici`
const dispatcher = new Agent({ connect: { ca: globalAgent.options.ca } });
setGlobalDispatcher(dispatcher);

// This make `net` module behave like node v18
setDefaultAutoSelectFamily(false);
