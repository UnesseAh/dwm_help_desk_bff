import {prisma} from "./prisma";

export async function createUserPrisma(
    name: string, email: string, passwordHash: string
) {
    const user = await prisma.user.create({
        data: { name, email, passwordHash },
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
