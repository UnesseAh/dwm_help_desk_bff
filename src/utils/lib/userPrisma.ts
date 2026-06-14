import { Role } from "../../generated/enums";
import {prisma} from "./prisma";


interface UpdatedFields {
    name?: string;
    email?: string;
    departmentId?: number;
    role?: Role;
}

export async function createUserPrisma(
    name: string, email: string, passwordHash: string
) {
    const user = await prisma.user.create({
        data: { name, email, passwordHash, role: Role.USER },
    });
    return user;
}


export async function getUserByNamePrisma(name: string) {
    if (!name) return null;
    const user = await prisma.user.findUnique({
        where: { name },
    });
    return user;
}

export async function getUserByIdPrisma(id: number) {
    if (!id) return null;
    const user = await prisma.user.findUnique({
        where: { id },
    });
    return user;
}


export async function updateUserPrisma(id: number, info: UpdatedFields){
    if (!id) return null;
    const user = await prisma.user.update({where: {id}, data: info});
    return user;
}

export async function changePasswordUserPrisma(id: number, hashedPassword: string) {
    if (!id) return null;
    const user = await prisma.user.update({where: {id}, data: {passwordHash: hashedPassword}});
    return user;
}