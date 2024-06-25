import { default as mssql } from "mssql";
import { notiDBConfig } from "./app-configs.js";
import type { App } from "./app.js";
import { Container } from "./container.js";

const init = async () => {
    const notiDB = await mssql.connect(notiDBConfig);

    const container = new Container().register().registerDatabases(notiDB);
    const app: App = container.resolve("app");
    app.initiate();
};
init();
