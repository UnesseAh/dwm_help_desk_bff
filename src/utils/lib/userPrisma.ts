import { Role } from "../../generated/enums";
import { prisma } from "./prisma";


interface UpdatedFields {
    name?: string;
    email?: string;
    departmentId?: number;
    role?: Role;
}

interface QuerySearch {
    name?: string;
    role?: string;
    departmentId?: number;
    isActivated?: boolean;
}


export async function getListUsersPrisma(quearySearch: QuerySearch, paginate: boolean, limit: number = 20, page: number = 1) {
    const query: any = {
        select: {
            id: true, name: true, email: true, service: {
                select: {
                    id: true,
                    name: true,
                    department: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            },
            role: true, isActivated: true, createdAt: true, passwordHash: false
        }, orderBy: { name: "asc" }
    };
    if (paginate) {
        const skip = (page - 1) * limit;
        query.take = limit;
        query.skip = skip;
    }
    const [users, totalRowCount] = await prisma.$transaction([
        prisma.user.findMany(query),
        prisma.user.count()
    ]);
    const pageCount = paginate ? Math.ceil(totalRowCount / limit) : 1;

    return {
        data: users,
        meta: {
            totalRowCount,
            pageCount,
            limit: paginate ? limit : totalRowCount,
            page: paginate ? page : 1,
        }
    };
}

export async function createUserPrisma(
    name: string, email: string, passwordHash: string
) {
    const user = await prisma.user.create({
        data: { name, email, passwordHash, role: Role.USER },
    });
    return user;
}


// this function used for authentification, so we need to retreive only activated user
export async function getUserByNamePrisma(name: string) {
    if (!name) return null;
    const user = await prisma.user.findUnique({
        where: { name, isActivated: true },
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


export async function updateUserPrisma(id: number, info: UpdatedFields) {
    if (!id) return null;
    const user = await prisma.user.update({ select: { id: true, name: true, isActivated: true }, where: { id }, data: info });
    return user;
}

export async function changePasswordUserPrisma(id: number, hashedPassword: string) {
    if (!id) return null;
    const user = await prisma.user.update({ where: { id }, data: { passwordHash: hashedPassword } });
    return user;
}

export async function toggleActivationUserPrisma(id: number) {
    if (!id) return null;
    const currentUser = await prisma.user.findUnique({
        where: { id },
        select: { isActivated: true },
    });
    if (!currentUser) return null;

    return prisma.user.update({
        select: { id: true, name: true, isActivated: true },
        where: { id },
        data: {
            isActivated: !currentUser.isActivated,
        },
    });
}

export async function statsUsersByRolePrisma() {
    const stats = await prisma.user.groupBy({
        by: ["role", "isActivated"],
        _count: {
            id: true
        }
    });

    let totalActivated = 0;
    let totalNotActivated = 0;
    const dataRolesStats = stats.reduce((acc, item) => {
        const role = item.role;
        if (!acc[role]) {
            acc[role] = {
                activated: 0,
                notActivated: 0,
                total: 0
            };
        }

        if (item.isActivated) {
            acc[role].activated = item._count.id;
            totalActivated += item._count.id;
        } else {
            acc[role].notActivated = item._count.id;
            totalNotActivated += item._count.id;
        }
        acc[role].total = acc[role].activated + acc[role].notActivated;
        return acc;
    }, {} as Record<string, { activated: number; notActivated: number, total: number }>);

    dataRolesStats['ALL'] = {
        activated: totalActivated,
        notActivated: totalNotActivated,
        total: totalActivated + totalNotActivated
    }
    return dataRolesStats;
}