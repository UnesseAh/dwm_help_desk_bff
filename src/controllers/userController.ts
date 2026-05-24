import createUserToken from "../utils/auth/createUserToken.js";
import { createUserPrisma, getUserByNamePrisma } from "../utils/lib/userPrisma";
import { compareWithHash, hashPassword } from "../utils/hashPassword.js";
import { NextFunction, Request, Response } from "express";

export async function userRegister(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body.user;

        const hashed = hashPassword(password);

        const user = await createUserPrisma(name, email, hashed);

        const token = await createUserToken(user);

        return res.status(201).json({ token: token });

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
        return res.json({ "token": token })
    } catch (error) {
        return next(error);
    }
}