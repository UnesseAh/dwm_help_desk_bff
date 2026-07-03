import { NextFunction, Request, Response } from "express";
import { TicketStatus } from "../generated/enums";
import { prisma } from "../utils/lib/prisma";

const ticketDetailsInclude = {
    client: { select: { id: true, name: true, email: true } },
    agent: { select: { id: true, name: true, email: true } },
    service: {
        select: {
            id: true,
            name: true,
            department: { select: { id: true, name: true } },
        },
    },
    messages: {
        orderBy: { createdAt: "asc" as const },
        include: { sender: { select: { id: true, name: true, role: true } } },
    },
};

async function getAccessibleTicket(ticketId: string, user: any) {
    const ticket = await prisma.ticket.findUnique({
        where: { id: BigInt(ticketId) },
        include: ticketDetailsInclude,
    });

    if (!ticket) return null;

    const isAdmin = user.role === "ADMIN";
    const isAssignedServiceAgent =
        user.role === "AGENT" && user.serviceId && ticket.serviceId.toString() === user.serviceId.toString();
    const isTicketClient = user.role === "USER" && ticket.clientId.toString() === user.id.toString();

    return isAdmin || isAssignedServiceAgent || isTicketClient ? ticket : false;
}

export async function ticketListGet(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user?.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        let tickets;
        
        if (user.role === 'ADMIN') {
            // Admin sees all tickets
            tickets = await prisma.ticket.findMany({
                include: { client: {select: {name:true}}, service: {select: {name:true}}, agent: {select: {name:true}} }
            });
        } else if (user.role === 'AGENT') {
            // Agent sees tickets related to their service
            if (!user.serviceId) {
                return res.status(403).json({ error: "Agent is not assigned to any service." });
            }
            tickets = await prisma.ticket.findMany({
                where: { serviceId: user.serviceId },
                include: { client: {select: {name:true}}, service: {select: {name:true}}, agent: {select: {name:true}} }
            });
        } else if (user.role === 'USER') {
            // Client sees tickets they created
            tickets = await prisma.ticket.findMany({
                where: { clientId: user.id },
                include: { client: {select: {name:true}}, service: {select: {name:true}}, agent: {select: {name:true}} }
            });
        } else {
            return res.status(403).json({ error: "Invalid role" });
        }

        return res.status(200).json(tickets);
    } catch (err) {
        return next(err);
    }
}

export async function ticketGet(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user?.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const ticketId = String(req.params.id);
        const ticket = await getAccessibleTicket(ticketId, user);
        if (ticket === null) return res.status(404).json({ error: "Ticket not found" });
        if (ticket === false) return res.status(403).json({ error: "Forbidden" });

        return res.status(200).json(ticket);
    } catch (err) {
        return next(err);
    }
}

export async function ticketStatusUpdate(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user?.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (user.role !== "AGENT" && user.role !== "ADMIN") {
            return res.status(403).json({ error: "Only agents and admins can change ticket status" });
        }

        const ticketId = String(req.params.id);
        const { status } = req.body as { status?: string };
        const validStatuses = Object.values(TicketStatus);
        if (!status || !validStatuses.includes(status as TicketStatus)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const ticket = await getAccessibleTicket(ticketId, user);
        if (ticket === null) return res.status(404).json({ error: "Ticket not found" });
        if (ticket === false) return res.status(403).json({ error: "Forbidden" });

        const updatedTicket = await prisma.ticket.update({
            where: { id: BigInt(ticketId) },
            data: {
                status: status as TicketStatus,
                ...(user.role === "AGENT" ? { agentId: BigInt(user.id) } : {}),
            },
            include: ticketDetailsInclude,
        });

        return res.status(200).json(updatedTicket);
    } catch (err) {
        return next(err);
    }
}

export async function ticketMessageCreate(req: Request, res: Response, next: NextFunction) {
    try {
        const user = (req as any).user?.user;
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const ticketId = String(req.params.id);
        const { content } = req.body as { content?: string };
        if (!content || !content.trim()) {
            return res.status(400).json({ error: "Message is required" });
        }

        const ticket = await getAccessibleTicket(ticketId, user);
        if (ticket === null) return res.status(404).json({ error: "Ticket not found" });
        if (ticket === false) return res.status(403).json({ error: "Forbidden" });

        const message = await prisma.message.create({
            data: {
                content: content.trim(),
                ticketId: BigInt(ticketId),
                senderId: BigInt(user.id),
            },
            include: { sender: { select: { id: true, name: true, role: true } } },
        });

        return res.status(201).json(message);
    } catch (err) {
        return next(err);
    }
}

export async function ticketCreate(req: Request, res: Response, next: NextFunction) {
  try {
    const user = (req as any).user?.user;
    if (!user) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { title, description, priority, serviceId, clientId } = req.body;
    // Basic validation
    if (!title || !description || !serviceId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Determine clientId based on role
    let finalClientId: any = user.id; // default for client user
    let agentId: any = undefined;

    if (user.role === "USER") {
      // client creates ticket for themselves
      finalClientId = user.id;
    } else if (user.role === "AGENT") {
      // Agent must provide clientId to create on behalf of a client
      if (!clientId) {
        return res.status(400).json({ error: "Agent must provide clientId" });
      }
      finalClientId = BigInt(clientId);
      agentId = BigInt(user.id);
    } else if (user.role === "ADMIN") {
      // Admin can specify clientId; if not provided, default to themselves (unlikely)
      if (clientId) {
        finalClientId = BigInt(clientId);
      } else {
        finalClientId = user.id;
      }
      // Admin may optionally set agentId via optional field (not required)
      if (req.body.agentId) {
        agentId = BigInt(req.body.agentId);
      }
    } else {
      return res.status(403).json({ error: "Invalid role" });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || "LOW",
        serviceId: BigInt(serviceId),
        clientId: finalClientId,
        ...(agentId && { agentId })
      }
    });

    return res.status(201).json(ticket);
  } catch (err) {
    return next(err);
  }
}
