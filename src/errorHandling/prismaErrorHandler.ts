import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import logger from  "../utils/logger.js";
import { NextFunction, Request, Response } from "express";

export default async function prismaErrorHandler(err: Error, req: Request, res: Response, next: NextFunction){
    if(!(err instanceof PrismaClientKnownRequestError)) return next(err);

    logger.debug(`treating PrismaKnownRequestError with code ${err.code}`);
    switch(err.code){
        case "P2002":
            return res.status(422).json({errors: [`this field ${err.meta?.target} is not unique`]});
        case "P2025":
            return res.status(422).json({
                errors: [`${err.meta?.cause}`],
            });
        default:
            logger.debug(`Unhandled error with code ${err.code} in prismaErrorHandler`);
            return res.sendStatus(500);
    }
}
