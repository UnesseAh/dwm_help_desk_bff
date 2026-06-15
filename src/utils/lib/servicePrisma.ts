import {prisma} from "./prisma";


interface HandledFields {
    name: string;
    departmentId: number;
}

export async function getServiceByIdPrisma(id: number) {
    if (!id) return null;
    const service = await prisma.service.findUnique({
        where: { id },
        select: {id: true, name: true, department: true, tickets: true},
    });
    return service;
}

export async function getListServicesPrisma(paginate: boolean = false, selectTickets: boolean, limit: number = 20, page: number = 1) {
    const query: any = { select: {id: true, name: true, department: true, tickets: selectTickets}, orderBy: {name: "asc"}};
    if(paginate){
        const skip = (page - 1) * limit;
        query.take = limit;
        query.skip = skip;
    }
    const [services, totalRowCount] = await prisma.$transaction([
        prisma.service.findMany(query),
        prisma.service.count()

    ]);
    const servicesData = services.map(({ departmentId, ...service }) => service);
    const pageCount = paginate ? Math.ceil(totalRowCount / limit) : 1;
    return {
        data: servicesData,
        meta: {
            totalRowCount,
            pageCount,
            limit: paginate ? limit : totalRowCount,
            page: paginate ? page : 1,
        }
    };
}

export async function createServicePrisma(info: HandledFields){
    const service = await prisma.service.create({
        select: {id: true, name: true, department: true},
        data: { name: info.name, departmentId: info.departmentId },
    });

    return service;
}

export async function updateServicePrisma(id:number, info: HandledFields){
    const service = await prisma.service.update({
        select: {id: true, name: true, department: true},
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