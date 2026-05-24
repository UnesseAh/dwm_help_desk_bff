import { NextFunction, Request, Response } from "express";
import { createDepartmentPrisma, deleteDepartmentPrisma, getDepartmentByIdPrisma, getListDepatmentsPrisma, updateDepartmentPrisma } from "../utils/lib/departmentPrisma";
import { ParsedQs } from "qs";


export async function departmentGet(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id as string;
    try {
        const department = await getDepartmentByIdPrisma(id);
        return res.status(200).json(department);
    } catch (err) {
        return next(err);
    }
}

function parseDepartmentListQuery(query: ParsedQs){
    const  {paginate, limit, offset}  = query;
    const limitNumber = limit ? parseInt(limit as string) : undefined;
    const offsetNUmber = offset ? parseInt(offset as string) : undefined;

    return {paginate, limitNumber, offsetNUmber};

}

export async function departmentListGet(req: Request, res: Response, next: NextFunction) {
    try {
        const {paginate, limitNumber, offsetNUmber} = parseDepartmentListQuery(req.query);
        const departments = await getListDepatmentsPrisma(paginate as string, limitNumber, offsetNUmber);
        return res.status(200).json(departments);
    } catch (err) {
        return next(err);
    }
}

export async function departmentCreate(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body.department;
        const department = await createDepartmentPrisma(name);
        return res.status(201).json(department);
    } catch (err) {
        return next(err);
    }
}

export async function departmentUpdate(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, info } = req.body.department;
        const department = await updateDepartmentPrisma(id, info);
        return res.status(201).json(department);
    } catch (err) {
        return next(err);
    }
}


export async function departmentDelete(req: Request, res: Response, next: NextFunction) {
    try{
        const id = req.params.id;
        const deleted = await deleteDepartmentPrisma(id as string);
        return deleted ? res.status(200).json({"msg": "Department deleted with success !"}) : res.status(400).json({"msg": "Department not deleted !"})
    } catch (err) {
        return next(err);
    }
}