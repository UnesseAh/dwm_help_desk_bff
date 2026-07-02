import dotennv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../../generated/client";

dotennv.config();

export default function createUserToken(user: User): string{
    if(!process.env.JWT_SECRET)
        throw new Error("JWT_SECRET missing in environment.");
    const userTokenObject = {user: {id: user.id, username: user.name, email: user.email, role: user.role, serviceId: user.serviceId}};
    const token = jwt.sign(userTokenObject, process.env.JWT_SECRET , {expiresIn: '2h'});
    return token;
}

