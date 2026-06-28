import createUserToken from "../utils/auth/createUserToken.js";
import { changePasswordUserPrisma, createUserPrisma, getListUsersPrisma, getUserByIdPrisma, getUserByNamePrisma, statsUsersByRolePrisma, toggleActivationUserPrisma, updateUserPrisma } from "../utils/lib/userPrisma";
import { compareWithHash, hashPassword } from "../utils/hashPassword.js";
import { NextFunction, Request, Response } from "express";
import { ParsedQs } from "qs";



function parseUserListQuery(query: ParsedQs){
    const  {querySearch, paginate, limit, page}  = query;

    const isPaginated = paginate === "true";

    const limitNumber = limit ? parseInt(limit as string) : undefined;
    const pageNumber = page ? parseInt(page as string) : undefined;

    return {querySearch, paginate: isPaginated, limitNumber, pageNumber};

}

export async function userListGet(req: Request, res: Response, next: NextFunction) {
    try {
        const {querySearch, paginate, pageNumber, limitNumber} = parseUserListQuery(req.query);
        const users = await getListUsersPrisma(querySearch as {} ,paginate, limitNumber, pageNumber);
        return res.status(200).json(users);
    } catch (err) {
        return next(err);
    }
}


export async function userRegister(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body.user;

        const hashed = hashPassword(password);

        const user = await createUserPrisma(name, email, hashed);

        return res.status(201).json({ status: "ok", message: "user created with success !"});

    } catch (err) {
        return next(err);
    }
}

export async function userLogin(req: Request, res: Response, next: NextFunction) {
    const { name, password } = req.body.user;

    try {
        const user = await getUserByNamePrisma(name);
        if (!user) return res.sendStatus(404);

        if (!compareWithHash(password, user.passwordHash)) return res.sendStatus(403);
        const token = await createUserToken(user);
        return res.status(201).json({ token: token , user : { name: user.name, email: user.email, department: user.departmentId, role: user.role} });
    } catch (error) {
        return next(error);
    }
}


export async function updateUser(req: Request, res: Response, next: NextFunction) {
    const { id, info } = req.body.user;
    try {
        const user = await updateUserPrisma(id, info);
        if (!user) return res.sendStatus(404);
        return res.json({ "user": user });
    } catch (error) {
        return next(error);
    }
}

export async function changePasswordUser(req: Request, res: Response, next: NextFunction) {
    const { id, oldPassword, newPassword } = req.body.user;

    try {
        const user = await getUserByIdPrisma(id);
        if (!user) return res.sendStatus(404);
    
        // check if the old password as the as stored one
        if (!compareWithHash(oldPassword, user.passwordHash)) return res.json({"error": "mismatched password !"});
        
        const hashed = hashPassword(newPassword);

        const userPasswordUpdated = await changePasswordUserPrisma(id, hashed);
        if(!userPasswordUpdated) return res.json({"error": "unable to change password !"}); 
        const token = await createUserToken(user);
        return res.status(201).json({ token: token });
    } catch (error) {
        return next(error);
    }
}

export async function toggleActivationUser(req: Request, res: Response, next: NextFunction){
    const { id } = req.body.user;
    try {
        const user = await toggleActivationUserPrisma(id);
        if (!user) return res.sendStatus(404);
        return res.json({ "user": user});
    } catch (error) {
        return next(error);
    }
}

export async function statsUsersByRoleUser(req: Request, res: Response, next: NextFunction){
    try {
        const data = await statsUsersByRolePrisma();
        return  res.status(200).json({"data": data});
    } catch (error) {
        return next(error);
    }
}