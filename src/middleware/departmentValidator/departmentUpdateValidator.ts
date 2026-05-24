import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../utils/types";

export default async function departmentUpdateValidator(req: Request, res: Response, next: NextFunction) {
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

    const { id, info } = department;
    if (!id) {
        errors.body.push("id property in department can't be empty");
    } 

    if (!info) {
        errors.body.push("info property in department can't be empty");
    } 

    if(errors.body.length) return res.status(400).json({errors});
    next();
}