import { App } from "../index";
import { PORT } from "../config/config";
const server = new App();
server.start(PORT);