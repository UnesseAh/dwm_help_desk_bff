import {prisma} from "./prisma";


interface UpdateFields {
    name?: string;
}

export async function getDepartmentByIdPrisma(id: string) {
    if (!id) return null;
    const department = await prisma.department.findUnique({
        where: { id },
        include: { services: true}
    });
    return department;
}

export async function getListDepatmentsPrisma(paginate = "false", limit?: number, offset?: number) {
    const query: any = { include: { services: true}, orderBy: {name: "asc"}};
    if(paginate){
        query.take = limit ?? 20;
        query.skip = offset ?? 0;
    }
    const departments = await prisma.department.findMany(query);
    return departments;
}

export async function createDepartmentPrisma(name: string){
    const department = await prisma.department.create({
        data: { name },
    });
    return department;
}

export async function updateDepartmentPrisma(id:string, info: UpdateFields){
    const department = await prisma.department.update({
        where: {id},
        data: info
    });
    return department;
}

export async function deleteDepartmentPrisma(id: string){
    const department = await getDepartmentByIdPrisma(id);
    if(department?.services.length == 0){
        await prisma.department.delete({where: {id}});
        return true;
    }
    return false;
}