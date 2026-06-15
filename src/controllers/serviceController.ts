import { NextFunction, Request, Response } from "express";
import { ParsedQs } from "qs";
import { createServicePrisma, deleteServicePrisma, getListServicesPrisma, getServiceByIdPrisma, updateServicePrisma } from "../utils/lib/servicePrisma";


export async function serviceGet(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    try {
        const service = await getServiceByIdPrisma(+id);
        if(service)
            return res.status(200).json(service);
        return res.status(404).json("NOT FOUND");
    } catch (err) {
        return next(err);
    }
}

function parseServiceListQuery(query: ParsedQs){
    const  {paginate, selectTickets,  limit, offset}  = query;
    const paginateBool = paginate  === "true" ? true : false; 
    const selectTicketsBool = selectTickets  === "true" ? true : false; 
    const limitNumber = limit ? parseInt(limit as string) : undefined;
    const offsetNUmber = offset ? parseInt(offset as string) : undefined;

    return {paginate: paginateBool, selectTickets: selectTicketsBool, limitNumber, offsetNUmber};

}

export async function serviceListGet(req: Request, res: Response, next: NextFunction) {
    try {
        const {paginate, selectTickets, limitNumber, offsetNUmber} = parseServiceListQuery(req.query);
        const services = await getListServicesPrisma(paginate, selectTickets,  limitNumber, offsetNUmber);
        return res.status(200).json(services);
    } catch (err) {
        return next(err);
    }
}

export async function serviceCreate(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, departmentId } = req.body.service;
        const service = await createServicePrisma({name, departmentId});
        return res.status(201).json(service);
    } catch (err) {
        return next(err);
    }
}

export async function serviceUpdate(req: Request, res: Response, next: NextFunction) {
    try {
        const { id, info } = req.body.service;
        const service = await updateServicePrisma(id, info);
        return res.status(201).json(service);
    } catch (err) {
        return next(err);
    }
}


export async function serviceDelete(req: Request, res: Response, next: NextFunction) {
    try{
        const id = req.params.id;
        const deleted = await deleteServicePrisma(+id);
        return deleted ? res.status(200).json({"msg": "Service deleted with success !"}) : res.status(400).json({"msg": "Service not deleted !"})
    } catch (err) {
        return next(err);
    }
}