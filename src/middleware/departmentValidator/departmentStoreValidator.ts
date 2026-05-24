import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../utils/types";

export default async function departmentStoreValidator(req: Request, res: Response, next: NextFunction) {
    const errors: ValidationError = {};
    errors.body = [];
    if (!req.body) {
        errors.body.push("cant't be empty");
        return res.status(400).json({ errors });
    }

    const { department } = req.body;
    if (!department) {
        errors.body.push("department object must be defined");
        return res.status(400).json({ errors });
    }

    const { name } = department;
    if (!name) {
        errors.body.push("name property in department can't be empty");
    } else if (typeof name != "string") {
        errors.body.push("name property in department must be a string")
    }

    if(errors.body.length) return res.status(400).json({errors});
    next();
}