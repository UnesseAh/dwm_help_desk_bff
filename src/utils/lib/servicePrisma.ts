import {prisma} from "./prisma";


interface HandledFields {
    name: string;
    departmentId: number;
}

export async function getServiceByIdPrisma(id: number) {
    if (!id) return null;
    const service = await prisma.service.findUnique({
        where: { id },
        include: { tickets: true}
    });
    return service;
}

export async function getListServicesPrisma(paginate = "false", limit?: number, offset?: number) {
    const query: any = { include: { tickets: true}, orderBy: {name: "asc"}};
    if(paginate){
        query.take = limit ?? 20;
        query.skip = offset ?? 0;
    }
    const services = await prisma.service.findMany(query);
    return services;
}

export async function createServicePrisma(info: HandledFields){
    const service = await prisma.service.create({
        data: { name: info.name, departmentId: info.departmentId },
    });
    return service;
}

export async function updateServicePrisma(id:number, info: HandledFields){
    const service = await prisma.service.update({
        where: {id},
        data: info
    });
    return service;
}

export async function deleteServicePrisma(id: number){
    const service = await getServiceByIdPrisma(id);
    if(service?.tickets.length == 0){
        await prisma.service.delete({where: {id}});
        return true;
    }
    return false;
}