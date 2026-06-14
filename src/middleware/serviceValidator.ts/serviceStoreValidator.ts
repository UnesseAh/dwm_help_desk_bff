import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../utils/types";

export default async function serviceStoreValidator(req: Request, res: Response, next: NextFunction) {
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

    const { name, departmentId } = service;
    if (!name) {
        errors.body.push("name property in service can't be empty");
    } else if (typeof name != "string") {
        errors.body.push("name property in service must be a string")
    }

     if (!departmentId) {
        errors.body.push("departmentId property in service can't be empty");
    } else if (typeof departmentId != "number") {
        errors.body.push("departmentId property in service must be a number")
    }

    if(errors.body.length) return res.status(400).json({errors});
    next();
}