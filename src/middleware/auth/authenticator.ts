import * as dotenv from "dotenv";
import { Request } from "express";
import { expressjwt as jwt} from "express-jwt";

dotenv.config();

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET missing in environment.")
}

function getTokenHeader(req: Request){
    const authorization = req.headers.authorization;
    if(!authorization) return;
    if(authorization.split(" ").length != 2) return;
    const [tag, token] = authorization.split(" ");
    if(tag === "Token" || tag === "Bearer") return token;
    return;
}


export const authenticate = jwt({
    algorithms: ["HS256"],
    secret: process.env.JWT_SECRET,
    getToken: getTokenHeader,
});

export const optionalAuthenticate = jwt({
    algorithms: ["HS256"],
    secret: process.env.JWT_SECRET,
    credentialsRequired: false,
    getToken: getTokenHeader,
})