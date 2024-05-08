import { app } from "../index";
import { PORT } from "../config/config";
const server = new app();
server.start(PORT);