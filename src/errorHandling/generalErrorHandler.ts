import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";


export default function generateErrorHandler(err: Error, _req: Request, res: Response, _next: NextFunction){
    logger.error(`Inhandled errror`);
    logger.error(`${err.message}\n{err.name}\n${err.stack}`);
    return res.sendStatus(500);
}