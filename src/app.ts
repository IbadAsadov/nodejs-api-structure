import express, { Request, Response, NextFunction } from "express";
import Logger from "./helpers/Logger";
import cors from "cors";
import { corsUrl, environment } from "./config";
import "./database";
import { NotFoundError, ApiError, InternalError, ErrorType } from "./helpers/ApiError";
import routes from "./routes";

process.on("uncaughtException", (e) => {
    Logger.error(e);
});

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

app.use("/", routes);

app.use((req, res, next) => next(new NotFoundError()));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        ApiError.handle(err, res);
        if (err.type === ErrorType.INTERNAL)
            Logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    } else {
        Logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        Logger.error(err);
        if (environment === "development") {
            return res.status(500).send(err);
        }
        ApiError.handle(new InternalError(), res);
    }
});

export default app;
