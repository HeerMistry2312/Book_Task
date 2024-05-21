import express from "express";
import { sequelize } from "./config/imports";
import session from "express-session";
import { SECRET_KEY } from "../src/config/imports";
import { errorHandlerMiddleware } from "./middleware/errorHandler";
import { AppError } from "./utils/imports";
import StatusConstants from "./constant/status.constant";
import { UserRoute, AdminRoute } from "./routes/imports";
export class App {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.connectDB();
    this.routes();
  }

  private config(): void {
    this.app.use(express.json());

    if (!SECRET_KEY) {
      throw new AppError(
        StatusConstants.NOT_FOUND.body.message,
        StatusConstants.NOT_FOUND.httpStatusCode
      );
    }
    this.app.use(
      session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24,
          secure: false,
          httpOnly: true,
        },
      })
    );
    this.app.use(errorHandlerMiddleware);
  }
  private async connectDB(): Promise<void> {
    try {
      await sequelize.authenticate();
      console.log(
        "Connection to PostgreSQL has been established successfully."
      );
      await sequelize.sync({ alter: true });
      console.log("Database synchronized");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  private routes(): void {
    const userRoute = new UserRoute().getRoute();
    const adminRoute = new AdminRoute().getRoute();
    // const authorRoute = new AuthorRoute().getRoute()
    // const bookRoute = new BookRoute().getRoute()
    // const cartRoute = new CartRoute().getRoute()
    this.app.use("/", userRoute);
    this.app.use("/admin", adminRoute);
    // this.app.use('/author', authorRoute)
    // this.app.use('/book', bookRoute)
    // this.app.use('/cart', cartRoute)
  }
  public start(port: string | undefined): void {
    this.app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}
