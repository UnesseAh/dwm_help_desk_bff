import dotennv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../../generated/client";

dotennv.config();

export default function createUserToken(user: User): string{
    if(!process.env.JWT_SECRET)
        throw new Error("JWT_SECRET missing in environment.");
    const tokenObject = {user: {username: user.name, email: user.email, role: user.role}};
    const userJSON = JSON.stringify(tokenObject);
    const token = jwt.sign(userJSON, process.env.JWT_SECRET /*, {expiresIn: '2h'}*/);
    return token;
}

