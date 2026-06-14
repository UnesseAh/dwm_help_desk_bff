import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../utils/types";

export default async function serviceUpdateValidator(req: Request, res: Response, next: NextFunction) {
    const errors: ValidationError = {};
    errors.body = [];
    if (!req.body) {
        errors.body.push("cant't be empty");
        return res.status(400).json({ errors });
    }

    const { service } = req.body;
    if (!service) {
        errors.body.push("service object must be defined");
        return res.status(400).json({ errors });
    }

    const { id, info } = service;
    if (!id) {
        errors.body.push("id property in service can't be empty");
    } 

    if (!info) {
        errors.body.push("info property in service can't be empty");
    } 

    if(errors.body.length) return res.status(400).json({errors});
    next();
}