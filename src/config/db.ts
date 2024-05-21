import { Sequelize } from "sequelize";
import { DB_NAME, NAME, PASSWORD, HOST } from "./config";

const sequelize = new Sequelize(DB_NAME!, NAME!, PASSWORD!, {
  host: HOST,
  dialect: "postgres",
  logging:false
});
export default sequelize