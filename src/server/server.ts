import { App } from "../index";
import { PORT } from "../config/imports";
const server = new App();
server.start(PORT);