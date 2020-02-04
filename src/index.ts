import express, { Request, RequestHandler, Response } from "express";
import { registerControllers } from "./utilities/ControllerRegistration";

const app = express()

// apply controllers
registerControllers(app)

app.listen(3000, () => console.log('The server is running'))
