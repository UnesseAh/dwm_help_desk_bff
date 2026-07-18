import {prisma} from "./prisma";


interface UpdateFields {
    name?: string;
}

export async function getDepartmentByIdPrisma(id: number) {
    if (!id) return null;
    const department = await prisma.department.findUnique({
        where: { id },
        include: { services: true}
    });
    return department;
}

export async function getListDepatmentsPrisma(paginate: boolean = false, limit: number = 20, page: number = 1) {
    const query: any = { include: { services: paginate}, orderBy: {name: "asc"}};
    if(paginate){
        const skip = (page  - 1) * limit;
        query.take = limit;
        query.skip = skip;
    }
    const [departments, totalRowCount] = await prisma.$transaction([
        prisma.department.findMany(query),
        prisma.department.count()
    ]);
    const pageCount = paginate ? Math.ceil(totalRowCount / limit) : 1;

    return {
        data: departments,
        meta: {
            totalRowCount,
            pageCount,
            limit: paginate ? limit : totalRowCount,
            page: paginate ? page : 1,
        }
    };
}

export async function createDepartmentPrisma(name: string){
    const department = await prisma.department.create({
        data: { name },
    });
    return department;
}

export async function updateDepartmentPrisma(id:number, info: UpdateFields){
    const department = await prisma.department.update({
        where: {id},
        data: info
    });
    return department;
}

export async function deleteDepartmentPrisma(id: number){
    const department = await getDepartmentByIdPrisma(id);
    if(department?.services.length == 0){
        await prisma.department.delete({where: {id}});
        return true;
    }
    return false;
}