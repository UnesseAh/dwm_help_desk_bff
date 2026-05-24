import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../utils/types";

export default async function userLoginValidator(req: Request, res: Response, next: NextFunction) {
    const errors: ValidationError = {};
    errors.body = [];
    if (!req.body) {
        errors.body.push("cant't be empty");
        return res.status(400).json({ errors });
    }

    const { user } = req.body;
    if (!user) {
        errors.body.push("user object must be defined");
        return res.status(400).json({ errors });
    }

    const { name, password } = user;
    if (!name) {
        errors.body.push("name property in user can't be empty");
    } else if (typeof name != "string") {
        errors.body.push("name property in user must be a string")
    }

    if (!password) {
        errors.body.push("password property in user can't be empty");
    } else if (typeof password != "string") {
        errors.body.push("password property in user must be a string")
    }

    if(errors.body.length) return res.status(400).json({errors});
    next();
}