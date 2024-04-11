import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";

// DB
import { connectDB } from "../config/db.config";
import { initFirebaseAdmin } from "../config/firebase.config";
const path = require("path");
const timeout = require("connect-timeout");

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8000";
    console.log("ENVIROMENT= ", process.env.NODE_ENV);
    //Headers
    this.headers();
    //DB
    this.dbConnection();
    //Middlewares
    this.middlewares();
    //Define routes
    this.routes();

    if (process.env.NODE_ENV !== "production") {
      require("dotenv").config();
    }
    this.initFirebase();
  }

  headers() {
    this.app.all("/*", function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
  }

  async dbConnection() {
    await connectDB();
  }

  routes() {
    this.app.use("/api/v1/user", require("../routes/user.routes"));
    this.app.use("/api/v1/developer", require("../routes/developer.routes"));
    this.app.use("/api/v1/client", require("../routes/client.routes"));
    this.app.use("/api/v1/comments", require("../routes/comments.routes"));
    this.app.use("/api/v1/instagram", require("../routes/instagram.routes"));
    this.app.use("/api/v1/bill", require("../routes/bill.routes"));
    this.app.use("/api/v1/tiktok", require("../routes/tiktok.routes"));
    this.app.use("/api/v1/position", require("../routes/position.routes"));
    this.app.use("/api/v1/messages", require("../routes/messages.routes"));
    this.app.use(
      "/api/v1/interaction",
      require("../routes/interaction.routes"),
    );
    this.app.use(
      "/api/v1/transactions",
      require("../routes/transactions.routes"),
    );
  }

  haltOnTimedout(req: any, res: any, next: any) {
    if (!req.timedout) next();
  }

  middlewares() {
    this.app.use(timeout("180s"));
    this.app.use(this.haltOnTimedout);
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    //Static files
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto " + this.port);
    });
  }

  initFirebase() {
    console.log("proccess.env", process.env.FIREBASE_PROJECT_ID);
    initFirebaseAdmin();
  }
}

export default Server;
