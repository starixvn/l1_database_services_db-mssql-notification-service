import dns from "evil-dns";
import { readFile } from "fs/promises";
import { globalAgent } from "https";
import { setDefaultAutoSelectFamily } from "net";
import { dirname, resolve } from "path";
import { rootCertificates } from "tls";
import { Agent, setGlobalDispatcher } from "undici";
import { fileURLToPath } from "url";
import { customHosts } from "./app-configs.js";

const CAs = await readFile(resolve(dirname(fileURLToPath(import.meta.url)), "./root-ca.cert.pem"), { encoding: "ascii" });

// Set CAs for `https`
globalAgent.options.ca = [...rootCertificates, CAs];

// Set CAs for `undici`
const dispatcher = new Agent({ connect: { ca: globalAgent.options.ca } });
setGlobalDispatcher(dispatcher);

// This make `net` module behave like node v18
setDefaultAutoSelectFamily(false);

// Add custom dns record
Object.entries(customHosts).forEach(([hostname, ip]) => {
    console.log(hostname, ip);
    dns.add(hostname, ip);
});
