import type { App } from "./app.js";
import { Container } from "./container.js";

const init = async () => {
    const container = new Container().register();
    const app: App = container.resolve("app");
    container.resolve("healthcheckServer");

    await app.initiate();
};
init();
