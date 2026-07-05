
import Router from "express";
import authorize from "../middleware/auth/authorize";
import { authenticate } from "../middleware/auth/authenticator";
import { statsTickets } from "../controllers/ticketController";

const router = Router();

router.use(authenticate);

router.get("/tickets", authorize(["ADMIN", "AGENT", "USER"]), statsTickets);


export default router;


