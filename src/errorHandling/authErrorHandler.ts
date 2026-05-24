import { UnauthorizedError } from "express-jwt";
import logger from "../utils/logger.js";
import { NextFunction, Request, Response } from "express";

export default async function authErrorHandler(err: Error, req: Request, res: Response, next: NextFunction){
    if(!(err instanceof UnauthorizedError)) return next(err);

    logger.debug(`Authorization failed due to ${err.code}`);
    switch(err.code){
        case "credentials_required":
            return res.sendStatus(401);
        case "credentials_bad_scheme":
            return res.status(400).json({
                errors: {header: ["authorization token was with bad scheme"]},
            });
        case "invalid_token":
            return res.status(401).json({
                errors: {header: ["authorization token us invalid"]}
            });
        default:
            logger.error(`Unhandled UnauthorizedError with code ${err.code}`);
            return res.sendStatus(500);
    }
}
