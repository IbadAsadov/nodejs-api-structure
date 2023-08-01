import mongoose from "mongoose";
import Logger from "../helpers/Logger";
import { db } from "../config";

// Build the connection string
const dbURI = `mongodb://${db.user}:${encodeURIComponent(db.password)}@${db.host}:${db.port}/${db.name}`;

mongoose
    .connect(dbURI)
    .then(() => {
        Logger.info("Mongoose connection done");
    })
    .catch((e) => {
        Logger.info("Mongoose connection error");
        Logger.error(e);
    });

mongoose.connection.on("connected", () => {
    Logger.debug("Mongoose default connection open to " + dbURI);
});

mongoose.connection.on("error", (err) => {
    Logger.error("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
    Logger.info("Mongoose default connection disconnected");
});

export const connection = mongoose.connection;
